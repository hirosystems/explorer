import { useState } from 'react';
import { useProgressBar } from '@components/progress-bar';

export const useLoading = (noProgressBar?: boolean) => {
  const [loading, setLoading] = useState('idle');
  const { start, done } = useProgressBar();
  const doStartLoading = () => {
    setLoading('pending');
    !noProgressBar && start();
  };

  const doFinishLoading = () => {
    setLoading('idle');
    !noProgressBar && done();
  };

  return {
    isLoading: loading === 'pending',
    doStartLoading,
    doFinishLoading,
  };
};
