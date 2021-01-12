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
    MAINNET_API_SERVER:
      process.env.NEXT_PUBLIC_MAINNET_API_SERVER || process.env.MAINNET_API_SERVER,
    TESTNET_API_SERVER:
      process.env.NEXT_PUBLIC_TESTNET_API_SERVER || process.env.TESTNET_API_SERVER,
    CONNECT_AUTH_ORIGIN:
      process.env.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN || process.env.CONNECT_AUTH_ORIGIN,
    DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL || process.env.DEPLOYMENT_URL,
    MAINNET_ENABLED: process.env.NEXT_PUBLIC_MAINNET_ENABLED || process.env.MAINNET_ENABLED,
  },
  webpack(config, { dev }) {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';

    // Install webpack aliases:
    const aliases = config.resolve.alias || (config.resolve.alias = {});

    if (!dev) {
      config.plugins.push(
        new BrotliPlugin({
          filename: '[path].br[query]',
          test: /\.js$|\.css$|\.html$/,
        })
      );
    }

    aliases['@emotion/react'] = '@emotion/react';
    aliases['@blockstack/stacks-transactions'] = '@stacks/transactions';
    aliases['@blockstack/stacks-transactions/lib/clarity'] = '@stacks/transactions/dist/clarity';

    return config;
  },
});
