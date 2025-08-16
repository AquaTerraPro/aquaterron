"use client";

import { useState } from 'react';

export default function VolumeCalculator() {
	const [lengthCm, setLengthCm] = useState<number>(60);
	const [widthCm, setWidthCm] = useState<number>(30);
	const [heightCm, setHeightCm] = useState<number>(35);

	const volumeLiters = Math.round((lengthCm * widthCm * heightCm) / 1000);

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Расчет объема воды</h1>
			<div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
				<NumberField label="Длина (см)" value={lengthCm} onChange={setLengthCm} />
				<NumberField label="Ширина (см)" value={widthCm} onChange={setWidthCm} />
				<NumberField label="Высота (см)" value={heightCm} onChange={setHeightCm} />
			</div>
			<div className="mt-6 text-lg">≈ <span className="font-semibold">{volumeLiters} л</span></div>
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