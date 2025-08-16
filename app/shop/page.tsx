const ITEMS = [
	{ id: 1, title: 'Фильтр внутренний 300л/ч', type: 'Аквариум', price: '1200 ₽' },
	{ id: 2, title: 'Лампа UVB 10.0', type: 'Террариум', price: '2100 ₽' },
	{ id: 3, title: 'Растение: анубиас', type: 'Аквариум', price: '350 ₽' }
];

export default function ShopPage() {
	return (
		<main className="container-max py-8">
			<h1 className="text-2xl font-display font-bold mb-4">Магазин</h1>
			<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{ITEMS.map((i) => (
					<li key={i.id} className="bg-white/5 rounded-lg p-4">
						<div className="font-semibold">{i.title}</div>
						<div className="text-sm text-white/70">{i.type}</div>
						<div className="mt-2 font-semibold">{i.price}</div>
						<button className="mt-2 px-3 py-2 rounded-md bg-base-accent text-black font-semibold">В корзину</button>
					</li>
				))}
			</ul>
		</main>
	);
}