"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Fish, Turtle, Leaf, Plus, User, Bell } from 'lucide-react';
import { useSystems } from '@/store/useSystems';
import { useToast } from './(ui)/Toast';
import { useBilling, FREE_MAX_SYSTEMS } from '@/store/useBilling';

const tabs = [
	{ key: 'aquarium', label: 'Аквариумы', icon: Fish, accent: 'text-base-accent' },
	{ key: 'terrarium', label: 'Террариумы', icon: Turtle, accent: 'text-terrarium-green' },
	{ key: 'paludarium', label: 'Палюдариумы', icon: Leaf, accent: 'text-base-accent' }
] as const;

type TabKey = typeof tabs[number]['key'];

export default function Home() {
	const [active, setActive] = useState<TabKey>('aquarium');
	const { systems, fetch, loading } = useSystems();

	useEffect(() => {
		fetch();
	}, [fetch]);

	return (
		<main className="container-max py-8">
			<header className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-display font-extrabold">Добро пожаловать, Пользователь</h1>
					<p className="text-sm text-white/70">Ваши биосистемы под контролем!</p>
				</div>
				<Link href="/profile" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
					<User size={22} />
					<span className="hidden sm:inline">Профиль</span>
				</Link>
			</header>

			<section className="mt-8">
				<div className="inline-flex bg-white/5 rounded-full p-1">
					{tabs.map(({ key, label, icon: Icon, accent }) => (
						<button
							key={key}
							onClick={() => setActive(key)}
							className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
								active === key ? 'bg-white text-black' : 'text-white/80 hover:text-white'
							}`}
						>
							<Icon size={18} className={active === key ? '' : accent} />
							<span className="text-sm font-medium">{label}</span>
						</button>
					))}
				</div>
			</section>

			<section className="mt-10">
				<div className="flex flex-wrap items-center gap-3">
					<Link
						href={systems.length >= FREE_MAX_SYSTEMS && !useBilling.getState().isPro ? '/auth' : `/wizard?type=${active}`}
						className="inline-flex items-center gap-2 bg-base-accent text-black font-semibold px-5 py-3 rounded-lg hover:opacity-90"
						onClick={(e) => {
							if (systems.length >= FREE_MAX_SYSTEMS && !useBilling.getState().isPro) {
								e.preventDefault();
								alert(`В бесплатной версии доступно до ${FREE_MAX_SYSTEMS} систем. Оформите PRO на странице входа.`);
							}
						}}
					>
						<Plus size={20} />
						Добавить новый {active === 'aquarium' ? 'аквариум' : active === 'terrarium' ? 'террариум' : 'палюдариум'}
					</Link>
					<Link href="/calendar" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-3 rounded-lg">
						<Bell size={18} />
						Календарь
					</Link>
				</div>
			</section>

			<section className="mt-8">
				<h2 className="text-lg font-display font-bold mb-3">Мои системы</h2>
				{loading ? (
					<div className="text-white/70 text-sm">Загрузка...</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{systems.map((s) => (
							<Link key={s.id} href={`/dashboard/${s.id}`} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition">
								<div className="flex items-center gap-3">
									<div className="size-10 rounded-lg bg-white/10 flex items-center justify-center">
										<Fish size={22} className="text-base-accent" />
									</div>
									<div className="flex-1">
										<div className="font-semibold">{s.title}</div>
										<div className="text-xs text-white/60">{s.volume_l ? `Объем: ${s.volume_l} л` : 'Статус: нормально'}</div>
									</div>
									<div className="text-xs text-white/60">12 дн. с подмены</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>
		</main>
	);
}