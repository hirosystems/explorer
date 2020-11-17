const webpack = require('webpack');
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    jsconfigPaths: true,
  },
  publicRuntimeConfig: {
    MOCKNET_API_SERVER: process.env.MOCKNET_API_SERVER,
    TESTNET_API_SERVER: process.env.TESTNET_API_SERVER,
    STAGING: process.env.STAGING,
  },
  webpack(config, { dev }) {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    if (!dev) {
      config.externals.unshift('elliptic');
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/));
      const splitChunks = config.optimization && config.optimization.splitChunks;
      if (splitChunks) {
        const cacheGroups = splitChunks.cacheGroups;
        const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
        if (cacheGroups.framework) {
          cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
            test,
          });
          cacheGroups.commons.name = 'framework';
        } else {
          cacheGroups.preact = {
            name: 'commons',
            chunks: 'all',
            test,
          };
        }
      }

      // Install webpack aliases:
      const aliases = config.resolve.alias || (config.resolve.alias = {});

      // aliases.react = aliases['react-dom'] = 'preact/compat';
      // aliases['react-ssr-prepass'] = 'preact-ssr-prepass';
      aliases['@blockstack/ui'] = '@stacks/ui';
      aliases['styled-components'] = '@emotion/react';
    }

    return config;
  },
});
