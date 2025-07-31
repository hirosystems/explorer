export async function stacksAPIFetch(url: string, options: RequestInit = {}) {
  const requestId = Math.random().toString(36).substring(2, 15);
  const startTime = Date.now();
  
  console.log(`[stacksAPIFetch:${requestId}] Starting request:`, {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? 'present' : 'none',
  });

  const headers = new Headers(options.headers || {});
  headers.set('x-api-key', process.env.EXPLORER_STACKS_API_KEY || '');

  console.log(`[stacksAPIFetch:${requestId}] API Key present:`, !!process.env.EXPLORER_STACKS_API_KEY);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const duration = Date.now() - startTime;
    
    console.log(`[stacksAPIFetch:${requestId}] Response received:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      duration: `${duration}ms`,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      console.error(`[stacksAPIFetch:${requestId}] Request failed:`, {
        url,
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
      });
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`[stacksAPIFetch:${requestId}] Request error:`, {
      url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    });

    throw error;
  }
}
