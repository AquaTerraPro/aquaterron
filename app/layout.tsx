import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from './(ui)/NavBar';
import { ToastViewport } from './(ui)/Toast';
import { ClientInit } from './(ui)/ClientInit';
import { Splash } from './(ui)/Splash';

export const metadata: Metadata = {
	title: 'Акватеррон',
	description: 'Универсальный личный кабинет для аквариумов, террариумов и палюдариумов'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ru">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
			</head>
			<body>
				<ClientInit />
				<Splash />
				<NavBar />
				{children}
				<ToastViewport />
			</body>
		</html>
	);
}