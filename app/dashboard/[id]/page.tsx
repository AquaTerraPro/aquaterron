"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, Calculator, CalendarDays, Store, MessageCircle, Users, Droplet, Sun, Lightbulb, PlugZap, Share2 } from 'lucide-react';
import { useSystems } from '@/store/useSystems';
import { useEvents } from '@/store/useEvents';
import { useShares } from '@/store/useShares';
import { useMarketplace } from '@/store/useMarketplace';

export default function DashboardPage({ params }: { params: { id: string } }) {
	const { systems, fetch } = useSystems();
	const { eventsBySystem, fetchForSystem } = useEvents();
	const { share } = useShares();
	const { specialists, fetchAll } = useMarketplace();
	const [specId, setSpecId] = useState('');
	const system = systems.find((s) => s.id === params.id);

	useEffect(() => {
		fetch();
		fetchForSystem(params.id);
		fetchAll();
	}, [fetch, fetchForSystem, fetchAll, params.id]);

	const lastWater = (eventsBySystem[params.id] ?? []).find((e) => e.type === 'water_change');
	const daysSince = lastWater ? Math.floor((Date.now() - new Date(lastWater.exec_at).getTime()) / 86400000) : '—';

	return (
		<main className="container-max py-8 space-y-8">
			<section className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-display font-extrabold">{system?.title ?? `Система #${params.id}`}</h1>
					<p className="text-sm text-white/70">Последняя подмена воды: {typeof daysSince === 'number' ? `${daysSince} дней назад` : 'нет данных'}</p>
				</div>
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center gap-2 text-sm bg-white/10 rounded-full px-3 py-1">
						<Droplet size={16} className="text-base-accent" />
						Загрязнение: среднее
					</span>
				</div>
			</section>

			{system?.photo_url && (
				<section>
					<img src={system.photo_url} alt={system.title} className="w-full max-w-2xl rounded-lg object-cover" />
				</section>
			)}

			<section className="bg-white/5 rounded-lg p-4">
				<h2 className="text-lg font-display font-bold mb-3">Поделиться доступом</h2>
				<div className="flex flex-wrap items-center gap-2">
					<select value={specId} onChange={(e) => setSpecId(e.target.value)} className="rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent">
						<option value="">Выберите специалиста</option>
						{specialists.map((p) => (
							<option key={p.user_id} value={p.user_id}>{p.name} — {p.disciplines.join(', ')}</option>
						))}
					</select>
					<button onClick={async () => { if (specId) { await share(specId, params.id); setSpecId(''); alert('Доступ предоставлен'); } }} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-base-accent text-black font-semibold"><Share2 size={16} />Дать доступ</button>
				</div>
				<div className="text-xs text-white/60 mt-2">Владелец может в любой момент отозвать доступ (UI разработки).</div>
			</section>

			<section>
				<h2 className="text-lg font-display font-bold mb-3">Уведомления</h2>
				<div className="grid gap-3">
					<div className="bg-white/5 rounded-lg p-4 flex items-start gap-3">
						<Bell size={20} className="mt-0.5 text-base-accent" />
						<div>
							<div className="font-semibold">Подмена воды</div>
							<div className="text-sm text-white/70">Твои рыбки собрались на митинг – где подмена, спрашивают?</div>
						</div>
					</div>
					<div className="bg-white/5 rounded-lg p-4 flex items-start gap-3">
						<Bell size={20} className="mt-0.5 text-base-accent" />
						<div>
							<div className="font-semibold">Чистка фильтра</div>
							<div className="text-sm text-white/70">Если хочешь видеть дно, а не ил – пора бы и почистить фильтр!</div>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h2 className="text-lg font-display font-bold mb-3">Калькуляторы</h2>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<Link href="/tools/volume" className="tile"><Calculator size={18} /><span>Расчет объема воды</span></Link>
					<Link href="/tools/substrate" className="tile"><Sun size={18} /><span>Расчет грунта</span></Link>
					<Link href="/tools/lighting" className="tile"><Lightbulb size={18} /><span>Освещение</span></Link>
					<Link href="/tools/power" className="tile"><PlugZap size={18} /><span>Электропотребление</span></Link>
					<Link href="/tools/humidity" className="tile"><Droplet size={18} /><span>Влажность (террариум)</span></Link>
					<Link href="/tools/heating" className="tile"><Sun size={18} /><span>Обогрев (террариум)</span></Link>
				</div>
			</section>

			<section>
				<h2 className="text-lg font-display font-bold mb-3">Календарь</h2>
				<div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm">
						<CalendarDays size={18} className="text-base-accent" />
						Запуск, подмена, чистка, замеры — всё фиксируется автоматически
					</div>
					<Link href="/calendar" className="text-sm text-base-accent">Открыть</Link>
				</div>
			</section>

			<section>
				<h2 className="text-lg font-display font-bold mb-3">Форум / AI-советник</h2>
				<div className="grid sm:grid-cols-2 gap-4">
					<Link href="/forum" className="tile"><MessageCircle size={18} /><span>Форум (К СУТИ)</span></Link>
					<Link href="/assistant" className="tile"><MessageCircle size={18} /><span>Спросить ИИ</span></Link>
				</div>
			</section>

			<section>
				<h2 className="text-lg font-display font-bold mb-3">Специалисты</h2>
				<div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm">
						<Users size={18} className="text-base-accent" />
						Найдите мастера рядом и запросите обслуживание
					</div>
					<Link href="/pros" className="text-sm text-base-accent">Открыть</Link>
				</div>
			</section>
		</main>
	);
}

export const dynamic = 'force-static';