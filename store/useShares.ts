"use client";

import { create } from 'zustand';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export type Share = {
	id: string;
	owner_id: string;
	specialist_id: string;
	system_id: string;
	created_at: string;
};

type State = {
	myShares: Share[]; // as owner
	forMe: Share[]; // systems shared to me
	loading: boolean;
	error?: string | null;
	share: (specialistId: string, systemId: string) => Promise<string | null>;
	fetchMine: () => Promise<void>;
	fetchForMe: () => Promise<void>;
};

export const useShares = create<State>((set) => ({
	myShares: [],
	forMe: [],
	loading: false,
	error: null,
	share: async (specialistId, systemId) => {
		try {
			if (!isSupabaseConfigured()) {
				const id = `shr_${Date.now()}`;
				const now = new Date().toISOString();
				set((s) => ({ myShares: [{ id, owner_id: 'me', specialist_id: specialistId, system_id: systemId, created_at: now }, ...s.myShares] }));
				return id;
			}
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) throw new Error('Не авторизован');
			const { data, error } = await supabase.from('shares').insert({ owner_id: user.id, specialist_id: specialistId, system_id: systemId }).select('id, created_at').single();
			if (error) throw error;
			set((s) => ({ myShares: [{ id: (data as any).id, owner_id: user.id, specialist_id: specialistId, system_id: systemId, created_at: (data as any).created_at }, ...s.myShares] }));
			return (data as any).id as string;
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка доступа' });
			return null;
		}
	},
	fetchMine: async () => {
		set({ loading: true, error: null });
		try {
			if (!isSupabaseConfigured()) { set({ loading: false }); return; }
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) throw new Error('Не авторизован');
			const { data } = await supabase.from('shares').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });
			set({ myShares: (data ?? []) as any, loading: false });
		} catch (e: any) { set({ error: e.message ?? 'Ошибка загрузки', loading: false }); }
	},
	fetchForMe: async () => {
		set({ loading: true, error: null });
		try {
			if (!isSupabaseConfigured()) { set({ loading: false }); return; }
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) throw new Error('Не авторизован');
			const { data } = await supabase.from('shares').select('*').eq('specialist_id', user.id).order('created_at', { ascending: false });
			set({ forMe: (data ?? []) as any, loading: false });
		} catch (e: any) { set({ error: e.message ?? 'Ошибка загрузки', loading: false }); }
	}
}));