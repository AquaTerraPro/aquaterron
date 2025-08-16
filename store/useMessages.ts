"use client";

import { create } from 'zustand';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export type Message = {
	id: string;
	order_id: string;
	author_id: string | null;
	content: string;
	created_at: string;
};

type State = {
	byOrder: Record<string, Message[]>;
	loading: boolean;
	error?: string | null;
	fetch: (orderId: string) => Promise<void>;
	send: (orderId: string, content: string) => Promise<string | null>;
};

export const useMessages = create<State>((set, get) => ({
	byOrder: {},
	loading: false,
	error: null,
	fetch: async (orderId) => {
		set({ loading: true, error: null });
		try {
			if (!isSupabaseConfigured()) {
				set((s) => ({ byOrder: { ...s.byOrder, [orderId]: (s.byOrder[orderId] ?? []) } }));
				set({ loading: false });
				return;
			}
			const supabase = getSupabaseClient()!;
			const { data, error } = await supabase.from('messages').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
			if (error) throw error;
			set((s) => ({ byOrder: { ...s.byOrder, [orderId]: (data ?? []) as any }, loading: false }));
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка загрузки', loading: false });
		}
	},
	send: async (orderId, content) => {
		try {
			if (!isSupabaseConfigured()) {
				const id = `msg_${Date.now()}`;
				const now = new Date().toISOString();
				const msg: Message = { id, order_id: orderId, author_id: 'me', content, created_at: now };
				set((s) => ({ byOrder: { ...s.byOrder, [orderId]: [ ...(s.byOrder[orderId] ?? []), msg ] } }));
				return id;
			}
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) throw new Error('Не авторизован');
			const { data, error } = await supabase.from('messages').insert({ order_id: orderId, author_id: user.id, content }).select('id, created_at').single();
			if (error) throw error;
			set((s) => ({ byOrder: { ...s.byOrder, [orderId]: [ ...(s.byOrder[orderId] ?? []), { id: (data as any).id, order_id: orderId, author_id: user.id, content, created_at: (data as any).created_at } ] } }));
			return (data as any).id as string;
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка отправки' });
			return null;
		}
	}
}));