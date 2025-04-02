import { useCallback, useEffect, useState } from 'react';

interface UseClipboardOptions {
  /**
   * Timeout delay (in ms) to switch back from "copied" state to "copy" state.
   * Set to 0 to disable automatic reset.
   */
  timeout?: number;
  /**
   * Initial value for the clipboard
   */
  initialValue?: string;
}

interface UseClipboardReturn {
  /**
   * Value to be copied to the clipboard
   */
  copyValue: string;
  /**
   * Function to copy text to clipboard
   */
  setValue: (text: string) => void;
  /**
   * If true, the text has been copied
   */
  copied: boolean;
  /**
   * Function to set the copied state
   */
  setCopied: (value: boolean) => void;
  /**
   * Reset the copied state
   */
  reset: () => void;
}

/**
 * Custom hook for copying content to clipboard with enhanced functionality
 *
 * @param options - Configuration options for the clipboard
 * @returns Object containing clipboard state and functions
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000, initialValue = '' } = options;

  const [copied, setCopied] = useState(false);
  const [copyValue, setCopyValue] = useState(initialValue);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  const setValue = useCallback(async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API when available and in secure context
      await navigator.clipboard.writeText(text);
      setCopied(true);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (copied && timeout > 0) {
      timeoutId = setTimeout(() => {
        setCopied(false);
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [copied, timeout]);

  return { copyValue, setValue, copied, setCopied, reset };
}
