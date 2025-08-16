/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		typedRoutes: true
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '**.supabase.co' }
		]
	}
};

export default nextConfig;