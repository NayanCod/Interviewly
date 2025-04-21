import type { NextConfig } from "next";
import withPWA from "next-pwa";


const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  reloadOnOnline: true
}

export default withPWA(pwaConfig)(nextConfig as any);
