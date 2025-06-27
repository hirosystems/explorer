import { logError } from '@/common/utils/error-utils';
import { Button, ButtonProps } from '@/ui/Button';
import * as Sentry from '@sentry/nextjs';
import React from 'react';

export interface SentryErrorButtonProps extends ButtonProps {
  errorMessage?: string;
  transactionName?: string;
  extraData?: Record<string, any>;
  severityLevel?: Sentry.SeverityLevel;
}

/**
 * A button component that logs an error to Sentry when clicked.
 * Useful for testing Sentry integration and error reporting.
 */
export const SentryErrorButton = React.forwardRef<HTMLButtonElement, SentryErrorButtonProps>(
  function SentryErrorButton(props, ref) {
    const {
      errorMessage = 'Test error triggered from SentryErrorButton',
      transactionName = 'manual-error-trigger',
      extraData = {},
      severityLevel = 'error',
      onClick,
      children = 'Trigger Sentry Error',
      ...rest
    } = props;

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        // Create a new Error with the provided message
        const error = new Error(errorMessage);

        // Add a custom property to identify this as a test error
        Object.defineProperty(error, 'isSentryTest', { value: true });

        // Log the error to Sentry
        logError(
          error,
          transactionName,
          {
            source: 'SentryErrorButton',
            timestamp: new Date().toISOString(),
            ...extraData,
          },
          severityLevel
        );

        // Call the original onClick handler if provided
        onClick?.(event);

        // Also log to console for immediate feedback
        console.error('Error sent to Sentry:', error);
      },
      [errorMessage, transactionName, extraData, severityLevel, onClick]
    );

    return (
      <Button ref={ref} bg="red.600" onClick={handleClick} {...rest}>
        {children}
      </Button>
    );
  }
);
