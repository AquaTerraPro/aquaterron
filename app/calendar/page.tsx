"use client";

import { useEffect } from 'react';
import { useEvents } from '@/store/useEvents';

export default function CalendarPage() {
	const { eventsBySystem, fetchAll, loading } = useEvents();

	useEffect(() => { fetchAll(); }, [fetchAll]);

	const flat = Object.values(eventsBySystem).flat();
	flat.sort((a, b) => new Date(b.exec_at).getTime() - new Date(a.exec_at).getTime());

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Календарь</h1>
			{loading ? (
				<div className="text-sm text-white/70">Загрузка...</div>
			) : (
				<ul className="grid gap-3 max-w-2xl">
					{flat.map((e) => (
						<li key={e.id} className="bg-white/5 rounded-lg p-4">
							<div className="text-sm text-white/60">{new Date(e.exec_at).toLocaleString()}</div>
							<div className="font-semibold">{label(e.type)}</div>
							{e.note && <div className="text-sm">{e.note}</div>}
						</li>
					))}
				</ul>
			)}
		</main>
	);
}

function label(t: string) {
	switch (t) {
		case 'launch': return 'Запуск';
		case 'water_change': return 'Подмена воды';
		case 'filter_clean': return 'Чистка фильтра';
		case 'measurement': return 'Замер параметров';
		case 'feeding': return 'Кормление';
		case 'shed': return 'Линька';
		default: return 'Заметка';
	}
}