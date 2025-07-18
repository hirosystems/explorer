// src/common/utils/api-fetch.ts
export async function stacksAPIFetch(url: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    
    // Add API key if needed
    headers.set('x-api-key', process.env.EXPLORER_STACKS_API_KEY || '');
    
    return fetch(url, {
      ...options,
      headers,
    });
  }