import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [new URL("https://teamwork.tf/images/**")],
	},
};

if (process.env.NODE_ENV === "development") {
	nextConfig.outputFileTracingRoot = path.join(__dirname, "../../");
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

// export default nextConfig;
module.exports = withBundleAnalyzer(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
