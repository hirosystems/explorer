const webpack = require('webpack');
const BrotliPlugin = require('brotli-webpack-plugin');

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
  webpack(config) {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/wordlists\/(?!english)/,
        contextRegExp: /bip39\/src$/,
      })
    );

    config.plugins.push(
      new BrotliPlugin({
        filename: '[path].br[query]',
        test: /\.js$|\.css$|\.html$/,
      })
    );

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

    aliases.react = aliases['react-dom'] = 'preact/compat';
    aliases['react-ssr-prepass'] = 'preact-ssr-prepass';

    return config;
  },
});
