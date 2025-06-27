const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)?', // Matches all pages
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Document-Policy',
            value: 'js-profiling',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  images: {
    domains: ['assets.hiro.so'],
  },
  // webpack: (config, { isServer }) => {
  //   // Ensure sourcemaps include source content
  //   if (!isServer) {
  //     config.devtool = 'source-map';
  //   }
  //   return config;
  // },
  webpack: (config, { isServer, dev }) => {
    // Ensure sourcemaps include source content
    if (!isServer) {
      // For production builds, use 'hidden-source-map' which generates complete sourcemaps
      // but does not include references to them in the JS files
      config.devtool = dev ? 'eval-source-map' : 'hidden-source-map';
    }

    // Ensure source content is included in sourcemaps
    if (!isServer && !dev) {
      // This ensures source content is included in the sourcemaps
      config.optimization.minimizer.forEach(minimizer => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.sourceMap = {
            includeSources: true,
          };
        }
      });
    }

    return config;
  },
};

// module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), {
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options

//   org: 'hirosystems',
//   project: 'explorer',

//   uploadSourceMaps: true,

//   // Include source content in sourcemaps
//   include: '.next',
//   ignore: ['node_modules', 'next.config.js'],

//   // Only print logs for uploading source maps in CI
//   // silent: !process.env.CI,
//   silent: false,

//   // For all available options, see:
//   // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//   // Upload a larger set of source maps for prettier stack traces (increases build time)
//   widenClientFileUpload: true,

//   // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//   // This can increase your server load as well as your hosting bill.
//   // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
//   // side errors will fail.
//   // tunnelRoute: "/monitoring",

//   // Hides source maps from generated client bundles
//   // Does NOT prevent source maps from being generated or uploaded to Sentry.
//   // While this hides sourcemaps from client bundles, it can sometimes interfere with proper sourcemap generation for Sentry.
//   hideSourceMaps: false,

//   // Automatically tree-shake Sentry logger statements to reduce bundle size
//   disableLogger: true,

//   // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
//   // See the following for more information:
//   // https://docs.sentry.io/product/crons/
//   // https://vercel.com/docs/cron-jobs
//   // automaticVercelMonitors: true,

//   experimental: {
//     instrumentationHook: true,
//   },

//   // Ensure Debug IDs are properly injected
//   injectClientSideDebugIds: true,
// });

// Sentry configuration with more explicit options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  org: 'hirosystems',
  project: 'explorer',

  // Enable sourcemap uploads
  uploadSourceMaps: true,

  // Include source content in sourcemaps
  include: '.next',
  ignore: ['node_modules', 'next.config.js'],

  // Ensure Debug IDs are properly injected
  injectClientSideDebugIds: true,

  // Only print logs for uploading source maps in CI
  silent: false,
  debug: true,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  // Does NOT prevent source maps from being generated or uploaded to Sentry.
  hideSourceMaps: false,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors
  experimental: {
    instrumentationHook: true,
  },

  // Ensure source maps are uploaded before the release is finalized
  setCommits: {
    auto: true,
  },

  // Ensure sourcemaps are uploaded with the correct release
  deploy: {
    env: process.env.NODE_ENV || 'production',
  },
};

// Apply Sentry configuration
module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), sentryWebpackPluginOptions);
