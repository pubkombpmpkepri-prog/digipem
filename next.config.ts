/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',                 // ⬅️ wajib untuk static export
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true,              // ⬅️ diperlukan untuk <Image> saat export
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' }
    ]
  }
};
module.exports = nextConfig;