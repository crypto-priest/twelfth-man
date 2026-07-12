/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async redirects() {
    return [
      { source: "/demo", destination: "/about#try-it", permanent: false },
      { source: "/leaderboard", destination: "/card#leaderboard", permanent: false },
    ];
  },
};

export default nextConfig;
