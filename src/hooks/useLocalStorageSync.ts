import { useEffect, useState } from 'react';

/**
 * A hook that synchronizes localStorage values between server and client
 * to prevent hydration mismatches and layout shifts.
 *
 * This hook solves the common issue of hydration mismatches that occur when
 * server-rendered content differs from client-side content due to localStorage
 * values being available only on the client.
 *
 * Implementation strategy:
 * 1. Always start with defaultValue for consistent server-side rendering
 * 2. After hydration, check localStorage for existing value
 * 3. Update state if localStorage value exists
 * 4. Keep localStorage in sync with state changes
 *
 * @param key - The localStorage key to synchronize
 * @param defaultValue - The default value to use if no value exists in localStorage
 * @returns [value, setValue] - The current value and a function to update it
 */
export function useLocalStorageSync<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Initialize state with defaultValue to ensure consistent server-side rendering
  // This prevents hydration mismatches as the server and client will start with the same value
  const [value, setValue] = useState<T>(defaultValue);

  // Track whether we're running on the client side
  // This helps prevent localStorage access during server-side rendering
  const [isClient, setIsClient] = useState(false);

  // This effect runs only on the client side after hydration
  // It synchronizes the state with any existing localStorage value
  useEffect(() => {
    // Mark that we're now running on the client
    setIsClient(true);

    // Attempt to retrieve and parse the stored value
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        // Parse the stored JSON value and update state
        setValue(JSON.parse(storedValue));
      } catch (e) {
        // Log error if stored value is invalid JSON
        console.error(`Error parsing localStorage value for key ${key}:`, e);
      }
    }
  }, [key]); // Only re-run if the key changes

  // This effect keeps localStorage in sync with state changes
  // It only runs on the client side and when the value changes
  useEffect(() => {
    if (isClient) {
      // Store the current value in localStorage
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, isClient]); // Re-run when key, value, or client status changes

  // Return the current value and a function to update it
  // This matches the useState API pattern
  return [value, setValue];
}
