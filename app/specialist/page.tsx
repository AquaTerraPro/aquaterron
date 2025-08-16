"use client";

import { useEffect } from 'react';
import { useMarketplace } from '@/store/useMarketplace';

export default function SpecialistPage() {
	const { inbox, services, fetchAll, fetchOrders } = useMarketplace();
	useEffect(() => { fetchAll(); fetchOrders(); }, [fetchAll, fetchOrders]);
	return (
		<main className="container-max py-8 space-y-6">
			<h1 className="text-2xl font-display font-bold">Кабинет специалиста</h1>
			<section>
				<h2 className="font-semibold mb-2">Входящие заказы</h2>
				<ul className="grid gap-3">
					{inbox.map((o) => (
						<li key={o.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
							<div>
								<div className="font-semibold">#{o.id.slice(0,6)} • {o.price} ₽</div>
								<div className="text-sm text-white/70">Статус: {o.status}</div>
							</div>
							<a href={`/chat/${o.id}`} className="text-sm text-base-accent">Открыть чат</a>
						</li>
					))}
				</ul>
			</section>
			<section>
				<h2 className="font-semibold mb-2">Мои услуги</h2>
				<ul className="grid gap-3">
					{services.map((s) => (
						<li key={s.id} className="bg-white/5 rounded-lg p-4">
							<div className="text-xs text-white/60">{s.discipline}</div>
							<div className="font-semibold">{s.title}</div>
							<div className="text-sm text-white/70">{s.price} {s.currency}</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}