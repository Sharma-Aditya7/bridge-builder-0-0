/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This is important for socket.io to work properly with Next.js
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
  // Configure allowed hostnames for server-side requests
  images: {
    domains: ['localhost'],
  }
};

module.exports = nextConfig;