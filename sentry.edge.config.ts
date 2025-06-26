// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

console.log('Initializing Sentry for Edge Runtime');
Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: 'https://e1dce4791416146de03ff1642ed719d5@o204651.ingest.us.sentry.io/4507788896239616',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
