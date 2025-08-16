"use client";

import { create } from 'zustand';

type Toast = { id: string; title: string; desc?: string };

type Store = {
	list: Toast[];
	push: (t: Omit<Toast, 'id'>) => void;
	remove: (id: string) => void;
};

export const useToast = create<Store>((set) => ({
	list: [],
	push: (t) => set((s) => ({ list: [...s.list, { id: crypto.randomUUID(), ...t }] })),
	remove: (id) => set((s) => ({ list: s.list.filter((x) => x.id !== id) }))
}));

export function ToastViewport() {
	const { list, remove } = useToast();
	return (
		<div className="fixed right-4 bottom-4 z-50 space-y-2">
			{list.map((t) => (
				<div key={t.id} className="bg-white text-black rounded-md px-4 py-3 shadow-lg min-w-64">
					<div className="font-semibold">{t.title}</div>
					{t.desc && <div className="text-sm text-black/70">{t.desc}</div>}
					<button className="mt-2 text-xs text-blue-700" onClick={() => remove(t.id)}>Закрыть</button>
				</div>
			))}
		</div>
	);
}