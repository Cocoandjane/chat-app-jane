/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    reactStrictMode: true,
    swcMinify: true
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.jsdelivr.net', 'lh3.googleusercontent.com', 'https://lh3.googleusercontent.com', "firebasestorage.googleapis.com",'cdn.pixabay.com']
  },
}

module.exports = nextConfig