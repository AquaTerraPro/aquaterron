import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
	return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseClient(): SupabaseClient | null {
	if (!isSupabaseConfigured()) return null;
	if (!client) {
		client = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL as string,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
		);
	}
	return client;
}