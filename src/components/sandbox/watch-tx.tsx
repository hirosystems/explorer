import * as React from 'react';
import { Flex, Stack, Button, Box } from '@stacks/ui';
import { useSSE } from 'react-hooks-sse';

import { withApiServer } from '@common/constants';
import { Field, Wrapper } from '@components/sandbox/common';

export const WatchTx = (props: any) => {
  const isBrowser = typeof window !== 'undefined';
  const state = useSSE('tx', {});

  return (
    <Wrapper title="Contract deploy" {...props}>
      <Box></Box>
    </Wrapper>
  );
};
