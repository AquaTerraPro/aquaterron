"use client";

import { create } from 'zustand';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export type EventType =
	| 'launch'
	| 'water_change'
	| 'filter_clean'
	| 'measurement'
	| 'feeding'
	| 'shed'
	| 'note';

export type SystemEvent = {
	id: string;
	system_id: string;
	type: EventType;
	note?: string | null;
	exec_at: string; // ISO
};

type State = {
	eventsBySystem: Record<string, SystemEvent[]>;
	loading: boolean;
	error?: string | null;
	fetchForSystem: (systemId: string) => Promise<void>;
	fetchAll: () => Promise<void>;
	create: (systemId: string, type: EventType, note?: string) => Promise<string | null>;
	getLastEvent: (systemId: string, type: EventType) => SystemEvent | undefined;
};

function sortByDateDesc(list: SystemEvent[]): SystemEvent[] {
	return [...list].sort((a, b) => new Date(b.exec_at).getTime() - new Date(a.exec_at).getTime());
}

export const useEvents = create<State>((set, get) => ({
	eventsBySystem: {},
	loading: false,
	error: null,
	fetchForSystem: async (systemId: string) => {
		set({ loading: true, error: null });
		try {
			if (!isSupabaseConfigured()) {
				const demo: SystemEvent[] = [
					{ id: 'e1', system_id: systemId, type: 'water_change', note: '30%', exec_at: new Date(Date.now() - 12 * 24 * 3600e3).toISOString() },
					{ id: 'e2', system_id: systemId, type: 'measurement', note: 'pH 7.2', exec_at: new Date(Date.now() - 2 * 24 * 3600e3).toISOString() }
				];
				set((s) => ({ eventsBySystem: { ...s.eventsBySystem, [systemId]: sortByDateDesc(demo) }, loading: false }));
				return;
			}
			const supabase = getSupabaseClient()!;
			const { data, error } = await supabase
				.from('events')
				.select('*')
				.eq('system_id', systemId)
				.order('exec_at', { ascending: false });
			if (error) throw error;
			set((s) => ({ eventsBySystem: { ...s.eventsBySystem, [systemId]: (data ?? []) as any }, loading: false }));
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка загрузки', loading: false });
		}
	},
	fetchAll: async () => {
		set({ loading: true, error: null });
		try {
			if (!isSupabaseConfigured()) {
				// no-op for demo
				set({ loading: false });
				return;
			}
			const supabase = getSupabaseClient()!;
			const { data, error } = await supabase
				.from('events')
				.select('*')
				.order('exec_at', { ascending: false });
			if (error) throw error;
			const map: Record<string, SystemEvent[]> = {};
			for (const ev of (data ?? []) as any as SystemEvent[]) {
				if (!map[ev.system_id]) map[ev.system_id] = [];
				map[ev.system_id].push(ev);
			}
			for (const k of Object.keys(map)) map[k] = sortByDateDesc(map[k]);
			set({ eventsBySystem: map, loading: false });
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка загрузки', loading: false });
		}
	},
	create: async (systemId, type, note) => {
		try {
			if (!isSupabaseConfigured()) {
				const id = String(Date.now());
				const ev: SystemEvent = { id, system_id: systemId, type, note: note ?? null, exec_at: new Date().toISOString() };
				set((s) => ({ eventsBySystem: { ...s.eventsBySystem, [systemId]: sortByDateDesc([ev, ...(s.eventsBySystem[systemId] ?? [])]) } }));
				return id;
			}
			const supabase = getSupabaseClient()!;
			const { data, error } = await supabase
				.from('events')
				.insert({ system_id: systemId, type, note: note ?? null })
				.select('id, system_id, type, note, exec_at')
				.single();
			if (error) throw error;
			set((s) => ({ eventsBySystem: { ...s.eventsBySystem, [systemId]: sortByDateDesc([data as any, ...(s.eventsBySystem[systemId] ?? [])]) } }));
			return (data as any).id as string;
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка сохранения' });
			return null;
		}
	},
	getLastEvent: (systemId, type) => {
		const list = get().eventsBySystem[systemId] ?? [];
		return list.find((e) => e.type === type);
	}
}));