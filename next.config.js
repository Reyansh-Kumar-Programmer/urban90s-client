const nextConfig = {
  // Disable ESLint during build (optional)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow remote images from Sanity
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

module.exports = nextConfig; // Use this for CommonJS
