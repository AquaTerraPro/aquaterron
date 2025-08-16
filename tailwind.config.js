/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			colors: {
				base: {
					bg: "#0C1E2C",
					accent: "#00C2A8",
					text: "#E4E4E4",
					warn: "#f97316",
					danger: "#ef4444"
				},
				terrarium: {
					sand: "#C2B280",
					green: "#4CAF50"
				}
			},
			fontFamily: {
				sans: ["var(--font-roboto)"],
				display: ["var(--font-montserrat)"]
			}
		}
	},
	plugins: []
};