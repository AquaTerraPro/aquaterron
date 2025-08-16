"use client";

import { useState } from 'react';

export default function SubstrateCalculator() {
	const [footprintCm2, setFootprintCm2] = useState<number>(60 * 30);
	const [layerDepthCm, setLayerDepthCm] = useState<number>(5);
	const [bulkDensity, setBulkDensity] = useState<number>(1.4); // kg/L typical gravel

	const liters = (footprintCm2 * layerDepthCm) / 1000; // cm^3 to liters
	const kilograms = Math.round(liters * bulkDensity * 10) / 10;

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Расчет грунта</h1>
			<div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
				<NumberField label="Основание (см²)" value={footprintCm2} onChange={setFootprintCm2} />
				<NumberField label="Слой (см)" value={layerDepthCm} onChange={setLayerDepthCm} />
				<NumberField label="Насыпная плотность (кг/л)" value={bulkDensity} onChange={(v) => setBulkDensity(v)} step={0.1} />
			</div>
			<div className="mt-6 text-lg">≈ <span className="font-semibold">{liters.toFixed(1)} л</span> / <span className="font-semibold">{kilograms.toFixed(1)} кг</span></div>
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