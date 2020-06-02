const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    jsconfigPaths: true,
  },
  serverRuntimeConfig: {
    MOCKNET_API_SERVER: process.env.MOCKNET_API_SERVER,
    TESTNET_API_SERVER: process.env.TESTNET_API_SERVER,
    STAGING: process.env.STAGING,
  },
  webpack(config, { dev }) {
    if (!dev) {
      config.externals.push('elliptic');
    }
    return config;
  },
});
