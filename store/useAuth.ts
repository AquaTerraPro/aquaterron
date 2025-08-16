"use client";

import { create } from 'zustand';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

type AuthUser = {
	id: string;
	email?: string | null;
	name?: string | null;
	isGuest?: boolean;
};

type AuthState = {
	user: AuthUser | null;
	loading: boolean;
	init: () => void;
	signInWithProvider: (provider: 'google' | 'yandex' | 'vk') => Promise<void>;
	signOut: () => Promise<void>;
	setGuestName: (name: string) => void;
	getDisplayName: () => string;
	isAuthenticated: () => boolean;
};

const GUEST_KEY = 'aquaterron_guest_name';

export const useAuth = create<AuthState>((set, get) => ({
	user: null,
	loading: true,
	init: () => {
		(async () => {
			try {
				if (isSupabaseConfigured()) {
					const supabase = getSupabaseClient()!;
					const { data } = await supabase.auth.getUser();
					if (data?.user) {
						const name = (data.user.user_metadata as any)?.name || (data.user.user_metadata as any)?.full_name || null;
						set({ user: { id: data.user.id, email: data.user.email, name, isGuest: false }, loading: false });
					} else {
						const localName = typeof window !== 'undefined' ? localStorage.getItem(GUEST_KEY) : null;
						if (localName) set({ user: { id: 'guest', name: localName, isGuest: true }, loading: false });
						else set({ user: null, loading: false });
					}
					supabase.auth.onAuthStateChange((_evt, session) => {
						if (session?.user) {
							const name = (session.user.user_metadata as any)?.name || (session.user.user_metadata as any)?.full_name || null;
							set({ user: { id: session.user.id, email: session.user.email, name, isGuest: false } });
						} else {
							const localName = typeof window !== 'undefined' ? localStorage.getItem(GUEST_KEY) : null;
							set({ user: localName ? { id: 'guest', name: localName, isGuest: true } : null });
						}
					});
				} else {
					const localName = typeof window !== 'undefined' ? localStorage.getItem(GUEST_KEY) : null;
					if (localName) set({ user: { id: 'guest', name: localName, isGuest: true }, loading: false });
					else set({ user: null, loading: false });
				}
			} catch (_e) {
				set({ loading: false });
			}
		})();
	},
	signInWithProvider: async (provider) => {
		if (!isSupabaseConfigured()) {
			alert('Supabase не сконфигурирован. Используйте гостевой вход.');
			return;
		}
		const supabase = getSupabaseClient()!;
		await supabase.auth.signInWithOAuth({ provider: provider as any, options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } });
	},
	signOut: async () => {
		if (isSupabaseConfigured()) {
			const supabase = getSupabaseClient()!;
			await supabase.auth.signOut();
		}
		if (typeof window !== 'undefined') {
			localStorage.removeItem(GUEST_KEY);
		}
		set({ user: null });
	},
	setGuestName: (name: string) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(GUEST_KEY, name);
		}
		set({ user: { id: 'guest', name, isGuest: true } });
	},
	getDisplayName: () => {
		const u = get().user;
		return u?.name || u?.email || 'Гость';
	},
	isAuthenticated: () => {
		return Boolean(get().user);
	}
}));