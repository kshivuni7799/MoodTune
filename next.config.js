/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      encoding: false,
      stream: false,
      zlib: false,
      util: false,
    };
    
    if (isServer) {
      config.externals.push('youtube-sr');
    }
    
    // Ensure proper module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@vladmandic/face-api': '@vladmandic/face-api/dist/face-api.esm.js',
    };

    return config;
  },
  // Disable server-side rendering for pages that use face-api
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig 