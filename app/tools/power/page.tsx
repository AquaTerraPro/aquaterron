"use client";

import { useState } from 'react';

export default function PowerCalculator() {
	const [watts, setWatts] = useState<number>(50);
	const [hoursPerDay, setHoursPerDay] = useState<number>(8);
	const [pricePerKwh, setPricePerKwh] = useState<number>(0.12);

	const kwhPerDay = (watts * hoursPerDay) / 1000;
	const monthlyCost = Math.round(kwhPerDay * 30 * pricePerKwh * 100) / 100;

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Электропотребление</h1>
			<div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
				<NumberField label="Мощность (Вт)" value={watts} onChange={setWatts} />
				<NumberField label="Часов в день" value={hoursPerDay} onChange={setHoursPerDay} />
				<NumberField label="Цена (за кВт⋅ч)" value={pricePerKwh} step={0.01} onChange={setPricePerKwh} />
			</div>
			<div className="mt-6 text-lg">≈ <span className="font-semibold">{kwhPerDay.toFixed(2)} кВт⋅ч/день</span> • ~ <span className="font-semibold">{monthlyCost.toFixed(2)}</span> в месяц</div>
		</main>
	);
}

function NumberField({ label, value, onChange, step }: { label: string; value: number; step?: number; onChange: (v: number) => void }) {
	return (
		<label className="block">
			<span className="text-sm text-white/80">{label}</span>
			<input
				type="number"
				value={value}
				step={step ?? 1}
				onChange={(e) => onChange(Number(e.target.value))}
				className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent"
			/>
		</label>
	);
}