import * as Sentry from '@sentry/nextjs';

import sentryOptions from './sentryOptions';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

function initSentry() {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampler: () => {
      try {
        if (window.location.search.includes('send-sample')) {
          return 1;
        }
        return 0.1;
      } catch (_) {
        return 0.1;
      }
    },
    ...sentryOptions,
  });
}

if (SENTRY_DSN) initSentry();
