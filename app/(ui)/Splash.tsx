"use client";

import { useEffect, useState } from 'react';

export function Splash() {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const shown = sessionStorage.getItem('splash_shown');
		if (!shown) {
			setVisible(true);
			const t = setTimeout(() => {
				setVisible(false);
				sessionStorage.setItem('splash_shown', '1');
			}, 1400);
			return () => clearTimeout(t);
		}
	}, []);
	if (!visible) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--splash-bg,rgba(12,30,44,0.98))]">
			<div className="flex flex-col items-center animate-fade-in">
				<img src="/logo.svg" alt="Акватеррон" className="w-24 h-24 drop-shadow-[0_0_30px_rgba(0,194,168,0.5)]" />
				<div className="mt-4 text-base-accent font-display text-2xl font-extrabold">Акватеррон</div>
				<div className="text-white/70 text-sm">Ваши биосистемы под контролем</div>
			</div>
			<style jsx>{`
				@keyframes fadeIn { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
				.animate-fade-in { animation: fadeIn 500ms ease-out both; }
			`}</style>
		</div>
	);
}