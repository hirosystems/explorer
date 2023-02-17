import * as Sentry from '@sentry/nextjs';

import sentryOptions from './sentryOptions';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

function initSentry() {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    ...sentryOptions,
  });
}

if (SENTRY_DSN) initSentry();
