/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',           // ⬅️ ganti dari 'export'
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
module.exports = nextConfig;