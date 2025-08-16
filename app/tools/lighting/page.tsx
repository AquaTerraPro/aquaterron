"use client";

import { useState } from 'react';

export default function LightingCalculator() {
	const [volumeL, setVolumeL] = useState<number>(60);
	const [plantType, setPlantType] = useState<'low' | 'med' | 'high'>('med');

	const wPerL = plantType === 'low' ? 0.3 : plantType === 'high' ? 0.8 : 0.5;
	const watts = Math.round(volumeL * wPerL);

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Освещение</h1>
			<div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
				<NumberField label="Объем (л)" value={volumeL} onChange={setVolumeL} />
				<label className="block">
					<span className="text-sm text-white/80">Тип растений</span>
					<select value={plantType} onChange={(e) => setPlantType(e.target.value as any)} className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent">
						<option value="low">Неприхотливые</option>
						<option value="med">Средние</option>
						<option value="high">Сложные</option>
					</select>
				</label>
			</div>
			<div className="mt-6 text-lg">≈ <span className="font-semibold">{watts} Вт</span> (ориентир)</div>
		</main>
	);
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
	return (
		<label className="block">
			<span className="text-sm text-white/80">{label}</span>
			<input
				type="number"
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent"
			/>
		</label>
	);
}