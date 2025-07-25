// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

console.log('Initializing Sentry for Browser Runtime');
Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: 'https://e1dce4791416146de03ff1642ed719d5@o204651.ingest.us.sentry.io/4507788896239616',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  beforeSend(event, hint) {
    const error = hint.originalException;
    const errorMessage = event.exception?.values?.[0]?.value || '';
    const filename = event.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename || '';

    if (
      filename.includes('gt-window-provider') ||
      errorMessage.includes('shouldSetTallyForCurrentProvider') ||
      errorMessage.includes('walletRouter')
    ) {
      console.log('Third-party extension error:', errorMessage);
      console.log(error);
      return null;
    }

    if (
      filename.startsWith('extension://') ||
      filename.startsWith('moz-extension://') ||
      filename.startsWith('chrome-extension://') ||
      filename.startsWith('safari-extension://')
    ) {
      console.log('Browser extension error:', errorMessage);
      console.log(error);
      return null;
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
