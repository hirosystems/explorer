import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  // TODO: Add a Sentry Release Github Action when switch to an org auth token
  // (ex: https://github.com/marketplace/actions/sentry-release)
  // environment: process.env.NODE_ENV,
  // release: `${process.env.SENTRY_PROJECT}@${process.env.npm_package_version}`,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
});
