"use client";

import { create } from 'zustand';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export type SystemType = 'aquarium' | 'terrarium' | 'paludarium';
export type System = {
	id: string;
	type: SystemType;
	title: string;
	volume_l?: number | null;
	launched_on?: string | null;
	photo_url?: string | null;
};

type State = {
	systems: System[];
	loading: boolean;
	error?: string | null;
	fetch: () => Promise<void>;
	create: (input: Omit<System, 'id'>, file?: File | null) => Promise<string | null>;
};

export const useSystems = create<State>((set, get) => ({
	systems: [],
	loading: false,
	error: null,
	fetch: async () => {
		set({ loading: true, error: null });
		try {
			if (!isSupabaseConfigured()) {
				// fallback demo data
				set({ systems: [{ id: '1', type: 'aquarium', title: 'Акавасс #1', volume_l: 60 }], loading: false });
				return;
			}
			const supabase = getSupabaseClient()!;
			const { data, error } = await supabase.from('systems').select('*').order('created_at', { ascending: false });
			if (error) throw error;
			set({ systems: (data ?? []) as any, loading: false });
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка загрузки', loading: false });
		}
	},
	create: async (input, file) => {
		try {
			if (!isSupabaseConfigured()) {
				const id = String(Date.now());
				set({ systems: [{ id, ...input }, ...get().systems] as any });
				return id;
			}
			const supabase = getSupabaseClient()!;
			let photo_url: string | undefined = undefined;
			if (file) {
				const ext = file.name.split('.').pop() ?? 'jpg';
				const path = `photos/${crypto.randomUUID()}.${ext}`;
				const { data: up, error: upErr } = await supabase.storage.from('systems').upload(path, file, { upsert: true });
				if (upErr) throw upErr;
				const { data: pub } = supabase.storage.from('systems').getPublicUrl(up!.path);
				photo_url = pub.publicUrl;
			}
			const { data, error } = await supabase
				.from('systems')
				.insert({ ...input, photo_url })
				.select('id')
				.single();
			if (error) throw error;
			await get().fetch();
			return data!.id as string;
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка сохранения' });
			return null;
		}
	}
}));