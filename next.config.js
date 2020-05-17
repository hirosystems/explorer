const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require('@zeit/next-source-maps')();

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = withSourceMaps(withBundleAnalyzer({
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
  env: {
    API_SERVER: process.env.API_SERVER || 'http://localhost:3999',
    API_ROUTE:
      process.env.NODE_ENV === 'production' ? process.env.API_SERVER : 'http://localhost:3000/api',
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    npm_package_version: process.env.npm_package_version,
  },
  webpack(config, { dev, isServer }) {
    if (!dev) {
      const splitChunks = config.optimization && config.optimization.splitChunks;
      if (splitChunks) {
        const cacheGroups = splitChunks.cacheGroups;
        const reactModules = /[\\/]node_modules[\\/](react|react-dom)[\\/]/;
        if (cacheGroups.framework) {
          cacheGroups.react = Object.assign({}, cacheGroups.framework, {
            test: reactModules,
          });
          cacheGroups.commons.name = 'framework';
        } else {
          cacheGroups.react = {
            name: 'commons',
            chunks: 'all',
            test: reactModules,
          };
        }
      }
      config.externals.push('elliptic');
    }

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }

    if (
      process.env.SENTRY_DSN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT &&
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.NODE_ENV === 'production'
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          urlPrefix: '~/_next',
        })
      );
    }

    return config;
  },
}));
