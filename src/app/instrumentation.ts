import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function register() {
  Sentry.init({
    enabled: process.env.NODE_ENV !== 'development',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 1.0,

    profileSessionSampleRate: 1.0,
    profileLifecycle: 'trace',

    integrations: [nodeProfilingIntegration()],

    debug: false,
  });
}
