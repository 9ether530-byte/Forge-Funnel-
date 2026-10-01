/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['**.manuspre.computer', '127.0.0.1'],
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
};

export default nextConfig;
