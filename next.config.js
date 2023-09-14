const { withSentryConfig } = require('@sentry/nextjs');

const withBundleAnalyzer =
  process.env.ANALYZE === 'true' ? require('@next/bundle-analyzer')() : x => x;

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const moduleExports = withBundleAnalyzer({
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/sandbox',
        destination: '/sandbox/deploy',
        permanent: false,
      },
    ];
  },
});

const sentryWebpackPluginOptions = {
  silent: false,
};

// const nextConfig = !!SENTRY_DSN
//   ? withSentryConfig(moduleExports, sentryWebpackPluginOptions)
//   : moduleExports;

const nextConfig = moduleExports;

module.exports = nextConfig;
