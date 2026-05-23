import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	// Use standalone output only for production builds. Avoid in dev to prevent
	// filesystem/symlink issues (e.g. OneDrive) when running `next dev`.
	output: isProd ? "standalone" : undefined
};

export default nextConfig;