// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

console.log('Initializing Sentry for Node.js Runtime', process.env.NODE_ENV === 'production');
Sentry.init({
  dsn: 'https://e1dce4791416146de03ff1642ed719d5@o204651.ingest.us.sentry.io/4507788896239616',
  enabled: process.env.NODE_ENV === 'production',
  integrations: [nodeProfilingIntegration()],

  profileSessionSampleRate: 0.1,

  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: 'trace',

  tracesSampleRate: 0.1,

  beforeSendTransaction(event) {
    // Skip static assets
    if (event.transaction?.includes('/_next/') || event.transaction?.includes('/favicon')) {
      return null;
    }
    return event;
  },

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
