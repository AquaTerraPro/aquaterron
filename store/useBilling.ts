"use client";

import { create } from 'zustand';

export const FREE_MAX_SYSTEMS = 2;

type BillingState = {
	isPro: boolean;
	upgradePro: () => void;
	setPro: (v: boolean) => void;
};

const KEY = 'aquaterron_is_pro';

export const useBilling = create<BillingState>((set) => ({
	isPro: typeof window !== 'undefined' ? localStorage.getItem(KEY) === '1' : false,
	upgradePro: () => {
		if (typeof window !== 'undefined') localStorage.setItem(KEY, '1');
		set({ isPro: true });
	},
	setPro: (v) => {
		if (typeof window !== 'undefined') localStorage.setItem(KEY, v ? '1' : '0');
		set({ isPro: v });
	}
}));