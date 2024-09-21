// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  //output: "export",
  assetPrefix: process.env.ASSET_PREFIX || "",
  basePath: process.env.BASE_PATH || "",
  images: {
    domains: ["localhost", "scan.vialabs.io", "anytoany.io"],
  },
};

module.exports = nextConfig;
