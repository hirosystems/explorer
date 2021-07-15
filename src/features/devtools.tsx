import React, { memo } from 'react';
import { useAtomValue } from 'jotai/utils';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDebugInView } from '../hooks/currently-in-view-hooks';
import { queryClientAtom } from 'jotai-query-toolkit';

export const DevtoolsPanel = memo(() => {
  const queryClient = useAtomValue(queryClientAtom);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
});

export const Devtools = () => (process.env.NODE_ENV === 'production' ? null : <DevtoolsPanel />);
export const AtomDebug = () => {
  useDebugInView();
  return null;
};
