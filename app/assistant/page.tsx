"use client";

import { useState } from 'react';

export default function AssistantPage() {
	const [q, setQ] = useState('У рыбы белые пятна — что делать?');
	const [a, setA] = useState('');

	function handleAsk() {
		setA('Похоже на ихтиофтириоз. Поднимите температуру до 28°С, обеспечьте дополнительную аэрацию, используйте препараты по инструкции. Проверьте аммиак и нитриты.');
	}

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">ИИ-советник</h1>
			<div className="max-w-2xl space-y-3">
				<textarea value={q} onChange={(e) => setQ(e.target.value)} className="w-full min-h-28 rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
				<button onClick={handleAsk} className="px-4 py-2 rounded-md bg-base-accent text-black font-semibold">Спросить</button>
				{a && (
					<div className="bg-white/5 rounded-lg p-4">
						<div className="text-sm text-white/70">Ответ:</div>
						<div>{a}</div>
					</div>
				)}
			</div>
		</main>
	);
}