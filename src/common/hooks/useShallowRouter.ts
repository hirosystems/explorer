import { useCallback } from 'react';

/**
 * A custom hook that provides a shallow routing implementation for Next.js.
 * This hook is designed to handle URL parameter updates without triggering
 * a full page reload, making it more efficient for client-side navigation.
 * It's particularly useful for maintaining state in the URL while avoiding
 * unnecessary re-renders of the entire page.
 */
export function useShallowRouter() {
  const replace = useCallback((data: any, unused: string, url?: string | URL | null) => {
    window.history.replaceState(data, unused, url);
  }, []);

  const push = useCallback((data: any, unused: string, url?: string | URL | null) => {
    window.history.pushState(data, unused, url);
  }, []);

  return {
    replace,
    push,
  };
}
