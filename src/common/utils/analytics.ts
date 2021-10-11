import * as snippet from '@segment/snippet';

export function renderSnippet() {
  const opts = {
    apiKey: process.env.SEGMENT_WRITE_KEY || process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    // The page option only covers SSR tracking. AppConfig.tsx is
    // used to track other events using `window.analytics.page()`
    page: true,
  };

  if (process.env.NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}
