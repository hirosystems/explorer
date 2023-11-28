import { getReasonPhrase } from 'http-status-codes';
import { useEffect, useState } from 'react';

import { ExplorerError } from '../types/Error';

async function getErrorResponseMessage(error: ExplorerError) {
  try {
    const response = await error.clone?.().json?.();
    return response?.error;
  } catch (e) {
    return undefined;
  }
}

export function useError(error: ExplorerError, defaultErrorName: string) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorName, setErrorName] = useState<string>('');
  const errorStatusCode = error.status;
  useEffect(() => {
    void getErrorResponseMessage(error).then(responseMessage => {
      if (responseMessage) {
        setErrorMessage(responseMessage);
        setErrorName(errorStatusCode ? getReasonPhrase(errorStatusCode) : defaultErrorName);
      } else if (error.message) {
        setErrorMessage(error.message);
        setErrorName(errorStatusCode ? getReasonPhrase(errorStatusCode) : defaultErrorName);
      } else if (errorStatusCode) {
        setErrorMessage(getReasonPhrase(errorStatusCode));
        setErrorName(defaultErrorName);
      } else {
        setErrorMessage('Something went wrong, please try again later.');
        setErrorName(defaultErrorName);
      }
    });
  }, [defaultErrorName, error, errorStatusCode]);

  return {
    errorName,
    errorStatusCode,
    errorMessage,
  };
}
