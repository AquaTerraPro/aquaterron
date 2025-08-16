"use client";

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSystems } from '@/store/useSystems';

function WizardInner() {
	const params = useSearchParams();
	const type = ((params?.get('type') ?? 'aquarium') as 'aquarium' | 'terrarium' | 'paludarium');
	const router = useRouter();
	const { create } = useSystems();
	const [title, setTitle] = useState('Мой первый объект');
	const [volume, setVolume] = useState<number>(60);
	const [date, setDate] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit() {
		setSubmitting(true);
		const id = await create({ title, type, volume_l: volume, launched_on: date || null, photo_url: null }, file);
		setSubmitting(false);
		if (id) router.push(`/dashboard/${id}`);
	}

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Добавление: {type}</h1>
			<div className="space-y-3 max-w-xl">
				<label className="block">
					<span className="text-sm text-white/80">Название</span>
					<input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" placeholder="Мой первый аквариум" />
				</label>
				<div className="grid grid-cols-2 gap-3">
					<label className="block">
						<span className="text-sm text-white/80">Объем (л)</span>
						<input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" placeholder="60" />
					</label>
					<label className="block">
						<span className="text-sm text-white/80">Дата запуска</span>
						<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
					</label>
				</div>
				<label className="block">
					<span className="text-sm text-white/80">Фото (опционально)</span>
					<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
				</label>
				<div className="flex gap-3">
					<Link href="/" className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15">Отмена</Link>
					<button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 rounded-md bg-base-accent text-black font-semibold disabled:opacity-60">{submitting ? 'Создаем...' : 'Создать'}</button>
				</div>
			</div>
		</main>
	);
}

export default function WizardPage() {
	return (
		<Suspense fallback={<div className="container-max py-8">Загрузка...</div>}>
			<WizardInner />
		</Suspense>
	);
}