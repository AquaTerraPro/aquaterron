"use client";

import { useEffect, useState } from 'react';
import { useMessages } from '@/store/useMessages';

export default function ChatPage({ params }: { params: { orderId: string } }) {
	const { byOrder, fetch, send } = useMessages();
	const msgs = byOrder[params.orderId] ?? [];
	const [text, setText] = useState('');
	useEffect(() => { fetch(params.orderId); }, [fetch, params.orderId]);
	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Чат заказа #{params.orderId.slice(0,6)}</h1>
			<div className="bg-white/5 rounded-lg p-4 max-w-3xl">
				<div className="space-y-2 max-h-[60vh] overflow-auto">
					{msgs.map((m) => (
						<div key={m.id} className="text-sm">
							<span className="text-white/60">{new Date(m.created_at).toLocaleString()}:</span> {m.content}
						</div>
					))}
				</div>
				<div className="mt-3 flex items-center gap-2">
					<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Написать сообщение" className="flex-1 rounded-md bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-base-accent" />
					<button onClick={async () => { if (text.trim()) { await send(params.orderId, text.trim()); setText(''); } }} className="px-3 py-2 rounded-md bg-base-accent text-black font-semibold">Отправить</button>
				</div>
			</div>
		</main>
	);
}