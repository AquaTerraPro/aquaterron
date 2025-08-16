"use client";

import { create } from 'zustand';

export type AppRole = 'user' | 'specialist';

const KEY = 'aquaterron_role';

type RoleState = {
	role: AppRole;
	setRole: (r: AppRole) => void;
	toggle: () => void;
};

export const useRole = create<RoleState>((set, get) => ({
	role: typeof window !== 'undefined' ? ((localStorage.getItem(KEY) as AppRole) || 'user') : 'user',
	setRole: (r) => {
		if (typeof window !== 'undefined') localStorage.setItem(KEY, r);
		set({ role: r });
	},
	toggle: () => {
		const next = get().role === 'user' ? 'specialist' : 'user';
		if (typeof window !== 'undefined') localStorage.setItem(KEY, next);
		set({ role: next });
	}
}));