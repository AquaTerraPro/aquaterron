"use client";

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import Link from 'next/link';

export default function AuthPage() {
	const { signInWithProvider, setGuestName } = useAuth();
	const [guest, setGuest] = useState('');

	function handleGuest() {
		if (guest.trim().length < 2) return;
		setGuestName(guest.trim());
		window.location.href = '/';
	}

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Вход</h1>
			<div className="grid gap-3 max-w-md">
				<button onClick={() => signInWithProvider('google')} className="px-4 py-2 rounded-md bg-white text-black">Войти через Google</button>
				<button onClick={() => signInWithProvider('yandex')} className="px-4 py-2 rounded-md bg-white text-black">Войти через Яндекс</button>
				<button onClick={() => signInWithProvider('vk')} className="px-4 py-2 rounded-md bg-white text-black">Войти через VK</button>
				<div className="h-px bg-white/10 my-3"></div>
				<label className="block">
					<span className="text-sm text-white/70">Или продолжить как гость</span>
					<input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="Ваше имя" className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
				</label>
				<button onClick={handleGuest} className="px-4 py-2 rounded-md bg-base-accent text-black font-semibold">Продолжить как гость</button>
			</div>
			<p className="text-sm text-white/60 mt-6">Вернуться на <Link className="text-base-accent" href="/">главную</Link></p>
		</main>
	);
}