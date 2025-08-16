"use client";

import { useState } from 'react';

export default function HeatingCalculator() {
	const [volumeL, setVolumeL] = useState(50);
	const [deltaT, setDeltaT] = useState(8);
	// rough rule: 1W per L per 0.03 of delta, simplified for guidance only
	const watts = Math.max(5, Math.round(volumeL * (deltaT * 0.1)));

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Калькулятор обогрева</h1>
			<div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
				<Field label="Объем (л)" value={volumeL} onChange={setVolumeL} />
				<Field label="ΔT (°C)" value={deltaT} onChange={setDeltaT} />
			</div>
			<div className="mt-6 text-lg">Рекомендация: ~ <span className="font-semibold">{watts} Вт</span></div>
			<div className="mt-2 text-sm text-white/70">Примечание: ориентировочная оценка, учитывайте вентиляцию и тип террариума.</div>
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