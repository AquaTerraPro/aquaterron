"use client";

import { useEffect, useState } from 'react';
import { useMarketplace, commissionForSpecialist } from '@/store/useMarketplace';
import { useRole } from '@/store/useRole';

export default function ProsPage() {
	const { specialists, services, fetchAll, becomeSpecialist, createService, placeOrder } = useMarketplace();
	const { role, toggle, setRole } = useRole();
	const [svcTitle, setSvcTitle] = useState('Онлайн-консультация (30 мин)');
	const [svcPrice, setSvcPrice] = useState(1500);
	const [svcDiscipline, setSvcDiscipline] = useState('ихтиолог');
	const [myCompleted, setMyCompleted] = useState(0);

	useEffect(() => { fetchAll(); }, [fetchAll]);

	return (
		<main className="container-max py-8 space-y-6">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-display font-bold">Специалисты и услуги</h1>
				<div className="text-sm bg-white/10 rounded-full px-3 py-1">Роль: <span className="font-semibold">{role === 'specialist' ? 'Специалист' : 'Пользователь'}</span> <button onClick={toggle} className="ml-2 text-base-accent">сменить</button></div>
			</header>

			<section className="bg-white/5 rounded-lg p-4">
				<h2 className="font-semibold mb-2">Стать специалистом</h2>
				<div className="text-sm text-white/70 mb-3">Укажите данные и начните принимать заказы. Комиссия сервиса снижается с ростом выполненных заказов: 15% → 13% → 11% → 9%.</div>
				<div className="flex flex-wrap gap-2 text-sm">
					<button onClick={() => { becomeSpecialist({ name: 'Я', disciplines: [svcDiscipline as any], bio: '', city: '' }); setRole('specialist'); }} className="px-3 py-2 rounded-md bg-base-accent text-black font-semibold">Стать специалистом</button>
					<div className="inline-flex items-center gap-2 bg-white/10 rounded-md px-3 py-2">Моя комиссия сейчас: <span className="font-semibold">{commissionForSpecialist(myCompleted)}%</span></div>
				</div>
			</section>

			{role === 'specialist' && (
				<section className="bg-white/5 rounded-lg p-4">
					<h2 className="font-semibold mb-2">Создать услугу</h2>
					<div className="grid sm:grid-cols-3 gap-3">
						<input value={svcTitle} onChange={(e) => setSvcTitle(e.target.value)} className="rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
						<select value={svcDiscipline} onChange={(e) => setSvcDiscipline(e.target.value)} className="rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent">
							<option value="ихтиолог">Ихтиолог</option>
							<option value="дизайнер">Дизайнер</option>
							<option value="герпетолог">Герпетолог</option>
							<option value="консультант">Консультант</option>
						</select>
						<input type="number" value={svcPrice} onChange={(e) => setSvcPrice(Number(e.target.value))} className="rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
					</div>
					<div className="mt-3">
						<button onClick={async () => { const id = await createService({ title: svcTitle, discipline: svcDiscipline as any, price: svcPrice, description: '' }); if (id) alert('Услуга создана'); }} className="px-3 py-2 rounded-md bg-base-accent text-black font-semibold">Опубликовать</button>
					</div>
				</section>
			)}

			<section>
				<h2 className="font-semibold mb-2">Услуги</h2>
				<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{services.map((s) => (
						<li key={s.id} className="bg-white/5 rounded-lg p-4">
							<div className="text-xs text-white/60">{s.discipline}</div>
							<div className="font-semibold">{s.title}</div>
							<div className="text-sm text-white/70">{s.price} {s.currency}</div>
							<button onClick={async () => { const id = await placeOrder(s.id, s.price, myCompleted); if (id) alert('Заявка отправлена'); }} className="mt-2 px-3 py-2 rounded-md bg-base-accent text-black font-semibold">Заказать</button>
						</li>
					))}
				</ul>
			</section>

			<section>
				<h2 className="font-semibold mb-2">Специалисты</h2>
				<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{specialists.map((pro) => (
						<li key={pro.user_id} className="bg-white/5 rounded-lg p-4">
							<div className="font-semibold">{pro.name}</div>
							<div className="text-sm text-white/70">{pro.city || '—'} • {pro.disciplines.join(', ')}</div>
							<div className="text-xs text-white/60">Рейтинг: {pro.rating ?? 0} ({pro.rating_count ?? 0})</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}