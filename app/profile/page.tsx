"use client";

import { useState } from 'react';

export default function ProfilePage() {
	const [name, setName] = useState('Пользователь');
	const [email, setEmail] = useState('user@example.com');

	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Профиль</h1>
			<div className="grid gap-3 max-w-xl">
				<label className="block">
					<span className="text-sm text-white/80">Имя</span>
					<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
				</label>
				<label className="block">
					<span className="text-sm text-white/80">Email</span>
					<input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
				</label>
				<button className="px-4 py-2 rounded-md bg-base-accent text-black font-semibold w-fit">Сохранить</button>
			</div>
		</main>
	);
}