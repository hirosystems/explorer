// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [Sentry.browserTracingIntegration(), Sentry.browserProfilingIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Add profilesSampleRate for browser profiling
  profilesSampleRate: 1.0,

  // Set tracePropagationTargets for your domain
  tracePropagationTargets: ['localhost', /^https:\/\/explorer\.hiro\.so/],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
