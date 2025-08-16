"use client";

import { useEffect } from 'react';
import { useMarketplace } from '@/store/useMarketplace';

export default function OrdersPage() {
	const { myOrders, inbox, fetchOrders, updateOrderStatus } = useMarketplace();
	useEffect(() => { fetchOrders(); }, [fetchOrders]);
	return (
		<main className="container-max py-8 space-y-6">
			<h1 className="text-2xl font-display font-bold">Заказы</h1>
			<section>
				<h2 className="font-semibold mb-2">Мои заказы</h2>
				<ul className="grid gap-3">
					{myOrders.map((o) => (
						<li key={o.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
							<div>
								<div className="font-semibold">Заказ #{o.id.slice(0, 6)} • {o.price} ₽</div>
								<div className="text-sm text-white/70">Статус: {o.status}</div>
							</div>
							<div className="text-xs text-white/60">Комиссия: {o.commission_percent}% ({o.commission_amount} ₽)</div>
						</li>
					))}
				</ul>
			</section>
			<section>
				<h2 className="font-semibold mb-2">Входящие (я — специалист)</h2>
				<ul className="grid gap-3">
					{inbox.map((o) => (
						<li key={o.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
							<div>
								<div className="font-semibold">Заказ #{o.id.slice(0, 6)} • {o.price} ₽</div>
								<div className="text-sm text-white/70">Статус: {o.status}</div>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<button onClick={() => updateOrderStatus(o.id, 'in_progress')} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15">В работу</button>
								<button onClick={() => updateOrderStatus(o.id, 'done')} className="px-3 py-1.5 rounded-md bg-base-accent text-black">Завершить</button>
							</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}