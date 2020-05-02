const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    jsconfigPaths: true,
    reactRefresh: true,
  },
  env: {
    API_SERVER: process.env.API_SERVER || 'http://localhost:3999',
    API_ROUTE:
      process.env.NODE_ENV === 'production' ? process.env.API_SERVER : 'http://localhost:3000/api',
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

    return config;
  },
});
