module.exports = {
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    jsconfigPaths: true,
  },
  env: {
    API_SERVER: process.env.API_SERVER || 'http://localhost:3999',
  },
  webpack(config, { dev, isServer }) {
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

    return config;
  },
};
