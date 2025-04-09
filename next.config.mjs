/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@lifi/widget", "@lifi/wallet-management"],
  images: {
    remotePatterns: [
      { hostname: "www.overtimemarkets.xyz", protocol: "https" },
      { hostname: "v2.overtimemarkets.xyz", protocol: "https" },
      { hostname: "overtimemarkets.xyz", protocol: "https" },
      { hostname: "cdn.cosmicjs.com", protocol: "https" },
      { hostname: "**", protocol: "https" },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
