"use client";

import { useBilling, FREE_MAX_SYSTEMS } from '@/store/useBilling';

export default function BillingPage() {
	const { isPro, upgradePro } = useBilling();
	return (
		<main className="container-max py-8 space-y-6">
			<h1 className="text-2xl font-display font-bold">Тарифы</h1>
			<section className="grid sm:grid-cols-2 gap-4 max-w-4xl">
				<div className="bg-white/5 rounded-lg p-4">
					<h2 className="font-semibold">Free</h2>
					<ul className="mt-2 text-sm text-white/80 list-disc pl-5">
						<li>До {FREE_MAX_SYSTEMS} систем</li>
						<li>Базовые калькуляторы</li>
						<li>Форум, специалисты</li>
					</ul>
				</div>
				<div className="bg-white/5 rounded-lg p-4">
					<h2 className="font-semibold">PRO</h2>
					<ul className="mt-2 text-sm text-white/80 list-disc pl-5">
						<li>Неограниченно систем</li>
						<li>Расширенный календарь и аналитика</li>
						<li>Снижение комиссий покупателя (−1 п.п.)</li>
					</ul>
					<div className="mt-3">
						{isPro ? (
							<div className="text-base-accent">У вас уже PRO</div>
						) : (
							<button onClick={upgradePro} className="px-4 py-2 rounded-md bg-base-accent text-black font-semibold">Оформить PRO</button>
						)}
					</div>
				</div>
			</section>
			<p className="text-sm text-white/60">Оплата интегрируется через провайдера (Stripe/ЮKassa). Сейчас включен демонстрационный сценарий.</p>
		</main>
	);
}