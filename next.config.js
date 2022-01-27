const { withSentryConfig } = require('@sentry/nextjs');
const BrotliPlugin = require('brotli-webpack-plugin');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const hasSentryDsn = !!process.env.SENTRY_DSN;

const moduleExports = withBundleAnalyzer({
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    NEXT_PUBLIC_TESTNET_API_SERVER: process.env.NEXT_PUBLIC_TESTNET_API_SERVER,
    NEXT_PUBLIC_MAINNET_API_SERVER: process.env.NEXT_PUBLIC_MAINNET_API_SERVER,
    NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER: process.env.NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER,
    NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL: process.env.NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL,
    NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL: process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL,
    NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE: process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE,
  },
  env: {
    NEXT_PUBLIC_DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    NEXT_PUBLIC_TESTNET_API_SERVER: process.env.NEXT_PUBLIC_TESTNET_API_SERVER,
    NEXT_PUBLIC_MAINNET_API_SERVER: process.env.NEXT_PUBLIC_MAINNET_API_SERVER,
    NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER: process.env.NEXT_PUBLIC_LEGACY_EXPLORER_API_SERVER,
    NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL: process.env.NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL,
    NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL: process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL,
    NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE: process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE,
    SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY,
    VERSION: process.env.VERSION,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  webpack(config, { dev }) {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    const aliases = config.resolve.alias || (config.resolve.alias = {});
    const externals = config.externals || [];

    if (!dev) {
      config.plugins.push(
        new BrotliPlugin({
          filename: '[path].br[query]',
          test: /\.js$|\.css$|\.html$/,
        })
      );
    }

    aliases['@blockstack/stacks-transactions'] = '@stacks/transactions';
    aliases['@blockstack/stacks-transactions/lib/clarity'] = '@stacks/transactions/dist/clarity';

    config.externals = externals;
    return config;
  },
});

const sentryWebpackPluginOptions = {
  silent: false,
};

const nextConfig = hasSentryDsn
  ? withSentryConfig(moduleExports, sentryWebpackPluginOptions)
  : moduleExports;

module.exports = nextConfig;
