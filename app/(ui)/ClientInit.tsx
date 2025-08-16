"use client";

import { useEffect } from 'react';
import { useAuth } from '@/store/useAuth';

export function ClientInit() {
	const { init } = useAuth();
	useEffect(() => { init(); }, [init]);
	return null;
}