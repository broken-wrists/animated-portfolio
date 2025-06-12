/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  transpilePackages: ['three'],
}

module.exports = nextConfig