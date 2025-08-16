-- Systems table to store aquariums/terrariums/paludariums
create table if not exists public.systems (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references auth.users(id) on delete cascade,
	type text not null check (type in ('aquarium','terrarium','paludarium')),
	title text not null,
	volume_l integer,
	launched_on date,
	photo_url text,
	created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists systems_user_id_idx on public.systems(user_id);

-- Tasks/Events (calendar)
create table if not exists public.events (
	id uuid primary key default gen_random_uuid(),
	system_id uuid references public.systems(id) on delete cascade,
	type text not null,
	note text,
	exec_at timestamp with time zone default now()
);

-- Storage bucket policy suggestion (create a bucket named `systems` in Supabase UI)
-- Make it public for read, only authenticated users can write.

-- Marketplace and roles
create table if not exists public.profiles (
	user_id uuid primary key,
	name text,
	is_specialist boolean default false,
	disciplines text[], -- e.g., {'ихтиолог','дизайнер','герпетолог'}
	bio text,
	city text,
	rating numeric default 0,
	rating_count integer default 0
);

create table if not exists public.services (
	id uuid primary key default gen_random_uuid(),
	specialist_id uuid references public.profiles(user_id) on delete cascade,
	title text not null,
	description text,
	discipline text not null,
	price numeric not null,
	currency text default 'RUB',
	created_at timestamptz default now()
);
create index if not exists services_discipline_idx on public.services(discipline);
create index if not exists services_specialist_idx on public.services(specialist_id);

create table if not exists public.orders (
	id uuid primary key default gen_random_uuid(),
	service_id uuid references public.services(id) on delete cascade,
	buyer_id uuid references auth.users(id) on delete set null,
	status text not null default 'requested', -- requested|paid|in_progress|done|cancelled
	price numeric not null,
	commission_percent numeric not null,
	commission_amount numeric not null,
	created_at timestamptz default now()
);
create index if not exists orders_buyer_idx on public.orders(buyer_id);
create index if not exists orders_service_idx on public.orders(service_id);

-- Shares: user grants specialist access to a system
create table if not exists public.shares (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid references auth.users(id) on delete cascade,
	specialist_id uuid references auth.users(id) on delete cascade,
	system_id uuid references public.systems(id) on delete cascade,
	created_at timestamptz default now(),
	unique(owner_id, specialist_id, system_id)
);

-- Order chat messages
create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	order_id uuid references public.orders(id) on delete cascade,
	author_id uuid references auth.users(id) on delete set null,
	content text not null,
	created_at timestamptz default now()
);
create index if not exists messages_order_idx on public.messages(order_id);