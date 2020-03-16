import * as React from 'react';
import { Status, Statuses } from '@components/status';
import { Tag, Transaction } from '@components/tags';

import { Box, Stack, Text, BoxProps } from '@blockstack/ui';

interface TitleProps extends BoxProps {
  status: Statuses;
  type: Transaction;
}

const TitleDetail: React.FC<TitleProps> = ({ status, type, ...rest }) => {
  return (
    <Box {...rest}>
      <Stack isInline spacing="tight">
        <Tag type={type} />
        <Status status={status} />
      </Stack>
    </Box>
  );
};

export const TransactionTitle: React.FC<TitleProps> = ({ status, type, ...rest }) => (
  <Stack {...rest}>
    <Box>
      <Text textStyle="display.large">Transaction details</Text>
    </Box>
    <TitleDetail status={status} type={type} />
  </Stack>
);
