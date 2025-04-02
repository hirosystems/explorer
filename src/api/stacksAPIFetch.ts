export async function stacksAPIFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});

  headers.set('x-api-key', process.env.EXPLORER_STACKS_API_KEY || '');

  return fetch(url, {
    ...options,
    headers,
  });
}
