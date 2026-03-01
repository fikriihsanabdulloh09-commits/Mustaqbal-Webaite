/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'i.pravatar.cc',
      'via.placeholder.com',
      'upload.wikimedia.org',
      'images.pexels.com',
      'kxozyztqrofpfdyglnja.supabase.co',
      'res.cloudinary.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
