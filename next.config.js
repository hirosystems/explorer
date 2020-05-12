const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    jsconfigPaths: true,
  },
  webpack(config, { dev }) {
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
