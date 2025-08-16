"use client";

import { useState } from 'react';

export default function HumidityCalculator() {
	const [tempC, setTempC] = useState(26);
	const [relative, setRelative] = useState(60);
	const [targetRelative, setTargetRelative] = useState(70);

	const deficit = Math.max(0, targetRelative - relative); // % to add
	const advice = deficit > 15 ? 'Требуется частое распыление и увлажнитель' : deficit > 5 ? 'Достаточно распыления 1-2 раза в день' : 'Влажность в норме';

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Калькулятор влажности</h1>
			<div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
				<Field label="Температура (°C)" value={tempC} onChange={setTempC} />
				<Field label="Текущее RH (%)" value={relative} onChange={setRelative} />
				<Field label="Целевое RH (%)" value={targetRelative} onChange={setTargetRelative} />
			</div>
			<div className="mt-6 text-lg">Дефицит: <span className="font-semibold">{deficit}%</span></div>
			<div className="mt-2 text-sm text-white/80">{advice}</div>
		</main>
	);
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
	return (
		<label className="block">
			<span className="text-sm text-white/80">{label}</span>
			<input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
		</label>
	);
}