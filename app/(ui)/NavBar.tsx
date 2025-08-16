"use client";

import Link from 'next/link';
import { useAuth } from '@/store/useAuth';
import { useRole } from '@/store/useRole';

export function NavBar() {
	const { user, getDisplayName, isAuthenticated, signOut } = useAuth();
	const { role, toggle } = useRole();
	return (
		<nav className="border-b border-white/10">
			<div className="container-max py-3 flex items-center gap-6 justify-between">
				<div className="flex items-center gap-6">
					<Link href="/" className="font-display font-extrabold text-base-accent">Акватеррон</Link>
					<div className="text-sm text-white/70 hidden sm:flex items-center gap-4">
						<Link href="/calendar" className="hover:text-white">Календарь</Link>
						<Link href="/shop" className="hover:text-white">Магазин</Link>
						<Link href="/forum" className="hover:text-white">Форум</Link>
						<Link href="/pros" className="hover:text-white">Специалисты</Link>
						<Link href="/orders" className="hover:text-white">Заказы</Link>
						<Link href="/billing" className="hover:text-white">PRO</Link>
					</div>
				</div>
				<div className="text-sm flex items-center gap-3">
					<button onClick={toggle} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 hidden sm:inline">{role === 'specialist' ? 'Роль: Специалист' : 'Роль: Пользователь'}</button>
					{isAuthenticated() ? (
						<>
							<span className="text-white/80">{getDisplayName()}</span>
							<button onClick={signOut} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15">Выйти</button>
						</>
					) : (
						<Link href="/auth" className="px-3 py-1.5 rounded-md bg-base-accent text-black font-semibold">Войти</Link>
					)}
				</div>
			</div>
		</nav>
	);
}