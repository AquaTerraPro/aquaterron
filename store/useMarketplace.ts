"use client";

import { create } from 'zustand';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export type Discipline = 'ихтиолог' | 'дизайнер' | 'герпетолог' | 'консультант';

export type SpecialistProfile = {
	user_id: string;
	name: string;
	is_specialist: boolean;
	disciplines: Discipline[];
	bio?: string | null;
	city?: string | null;
	rating?: number | null;
	rating_count?: number | null;
};

export type Service = {
	id: string;
	specialist_id: string;
	title: string;
	description?: string | null;
	discipline: Discipline;
	price: number;
	currency: string;
};

export type Order = {
	id: string;
	service_id: string;
	buyer_id: string | null;
	status: 'requested' | 'paid' | 'in_progress' | 'done' | 'cancelled';
	price: number;
	commission_percent: number;
	commission_amount: number;
	created_at: string;
};

type State = {
	specialists: SpecialistProfile[];
	services: Service[];
	myOrders: Order[]; // as buyer
	inbox: Order[]; // for me as specialist
	loading: boolean;
	error?: string | null;
	fetchAll: () => Promise<void>;
	fetchOrders: () => Promise<void>;
	becomeSpecialist: (profile: Omit<SpecialistProfile, 'user_id' | 'is_specialist'>) => Promise<void>;
	createService: (input: Omit<Service, 'id' | 'specialist_id' | 'currency'> & { currency?: string }) => Promise<string | null>;
	placeOrder: (serviceId: string, price: number, specialistCompleted?: number) => Promise<string | null>;
	updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
};

export function commissionForSpecialist(completedOrders: number): number {
	// Tiered: 0-9:15%, 10-49:13%, 50-199:11%, 200+:9%
	if (completedOrders >= 200) return 9;
	if (completedOrders >= 50) return 11;
	if (completedOrders >= 10) return 13;
	return 15;
}

export const useMarketplace = create<State>((set, get) => ({
	specialists: [],
	services: [],
	myOrders: [],
	inbox: [],
	loading: false,
	error: null,
	fetchAll: async () => {
		set({ loading: true, error: null });
		try {
			if (!isSupabaseConfigured()) {
				set({
					specialists: [
						{ user_id: 's1', name: 'Ихтиолог Анна', is_specialist: true, disciplines: ['ихтиолог'], city: 'Москва', rating: 4.9, rating_count: 112 },
						{ user_id: 's2', name: 'Дизайнер Елена', is_specialist: true, disciplines: ['дизайнер'], city: 'СПб', rating: 4.8, rating_count: 85 }
					],
					services: [
						{ id: 'svc1', specialist_id: 's1', title: 'Консультация по болезням рыб (30 мин)', description: 'Диагностика симптомов, рекомендации', discipline: 'ихтиолог', price: 1500, currency: 'RUB' },
						{ id: 'svc2', specialist_id: 's2', title: 'Дизайн аквариума под ключ', description: 'Подбор растений, оформление, свет', discipline: 'дизайнер', price: 5000, currency: 'RUB' }
					]
				, loading: false });
				return;
			}
			const supabase = getSupabaseClient()!;
			const [{ data: profs }, { data: svcs }] = await Promise.all([
				supabase.from('profiles').select('*').eq('is_specialist', true),
				supabase.from('services').select('*').order('created_at', { ascending: false })
			]);
			set({ specialists: (profs ?? []) as any, services: (svcs ?? []) as any, loading: false });
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка загрузки', loading: false });
		}
	},
	fetchOrders: async () => {
		try {
			if (!isSupabaseConfigured()) return;
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) return;
			const { data: my } = await supabase.from('orders').select('*').eq('buyer_id', user.id).order('created_at', { ascending: false });
			const { data: inbox } = await supabase
				.from('orders')
				.select('*, services!inner(specialist_id)')
				.eq('services.specialist_id', user.id)
				.order('created_at', { ascending: false });
			set({ myOrders: (my ?? []) as any, inbox: (inbox ?? []) as any });
		} catch (e: any) { set({ error: e.message ?? 'Ошибка загрузки' }); }
	},
	becomeSpecialist: async (profile) => {
		try {
			if (!isSupabaseConfigured()) {
				set((s) => ({ specialists: [{ user_id: 'me', name: profile.name, is_specialist: true, disciplines: profile.disciplines, bio: profile.bio, city: profile.city }, ...s.specialists] }));
				return;
			}
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) throw new Error('Не авторизован');
			await supabase.from('profiles').upsert({ user_id: user.id, name: profile.name, is_specialist: true, disciplines: profile.disciplines, bio: profile.bio, city: profile.city });
			await get().fetchAll();
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка сохранения' });
		}
	},
	createService: async (input) => {
		try {
			const currency = input.currency ?? 'RUB';
			if (!isSupabaseConfigured()) {
				const id = `svc_${Date.now()}`;
				set((s) => ({ services: [{ id, specialist_id: 'me', title: input.title, description: input.description ?? null, discipline: input.discipline, price: input.price, currency }, ...s.services] }));
				return id;
			}
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) throw new Error('Не авторизован');
			const { data, error } = await supabase.from('services').insert({ specialist_id: user.id, title: input.title, description: input.description ?? null, discipline: input.discipline, price: input.price, currency }).select('id').single();
			if (error) throw error;
			await get().fetchAll();
			return (data as any).id as string;
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка сохранения' });
			return null;
		}
	},
	placeOrder: async (serviceId, price, specialistCompleted = 0) => {
		try {
			const commission_percent = commissionForSpecialist(specialistCompleted);
			const commission_amount = Math.round(price * (commission_percent / 100));
			if (!isSupabaseConfigured()) {
				const id = `ord_${Date.now()}`;
				const now = new Date().toISOString();
				set((s) => ({ myOrders: [{ id, service_id: serviceId, buyer_id: 'me', status: 'requested', price, commission_percent, commission_amount, created_at: now }, ...s.myOrders] }));
				return id;
			}
			const supabase = getSupabaseClient()!;
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) throw new Error('Не авторизован');
			const { data, error } = await supabase.from('orders').insert({ service_id: serviceId, buyer_id: user.id, status: 'requested', price, commission_percent, commission_amount }).select('id, created_at').single();
			if (error) throw error;
			set((s) => ({ myOrders: [{ id: (data as any).id, service_id: serviceId, buyer_id: user.id, status: 'requested', price, commission_percent, commission_amount, created_at: (data as any).created_at }, ...s.myOrders] }));
			return (data as any).id as string;
		} catch (e: any) {
			set({ error: e.message ?? 'Ошибка заказа' });
			return null;
		}
	},
	updateOrderStatus: async (orderId, status) => {
		try {
			if (!isSupabaseConfigured()) {
				set((s) => ({ myOrders: s.myOrders.map((o) => (o.id === orderId ? { ...o, status } : o)), inbox: s.inbox.map((o) => (o.id === orderId ? { ...o, status } : o)) }));
				return;
			}
			const supabase = getSupabaseClient()!;
			const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
			if (error) throw error;
			set((s) => ({ myOrders: s.myOrders.map((o) => (o.id === orderId ? { ...o, status } : o)), inbox: s.inbox.map((o) => (o.id === orderId ? { ...o, status } : o)) }));
		} catch (e: any) { set({ error: e.message ?? 'Ошибка обновления статуса' }); }
	}
}));