"use client";

import { useState } from 'react';

const THREADS = [
	{ id: 1, title: 'Белые пятна у гуппи', body: 'У рыбы появились белые пятна после запуска. Температура 24°С...' },
	{ id: 2, title: 'Помутнела вода', body: 'После кормления вода стала мутной, фильтр работает...' }
];

export default function ForumPage() {
	const [summaryId, setSummaryId] = useState<number | null>(null);

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Форум</h1>
			<ul className="grid gap-3">
				{THREADS.map((t) => (
					<li key={t.id} className="bg-white/5 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<div className="font-semibold">{t.title}</div>
							<button onClick={() => setSummaryId(t.id)} className="px-3 py-1.5 rounded-md bg-base-accent text-black font-semibold">К СУТИ</button>
						</div>
						<p className="text-sm text-white/70 mt-2">{t.body}</p>
						{summaryId === t.id && (
							<p className="text-sm mt-3 text-white">Итог: вероятная ихтиофтириозная инфекция. Поднять температуру до 28°С, добавить соль по инструкции, рассмотреть метиленовый синий. Проверить аммиак/нитрит.</p>
						)}
					</li>
				))}
			</ul>
		</main>
	);
}