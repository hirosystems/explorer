import * as React from 'react';
import { Status, Statuses } from '@components/status';
import { Tag, Transaction } from '@components/tags';

import { Box, Stack, Text, BoxProps } from '@blockstack/ui';

interface TitleProps extends BoxProps {
  status: Statuses;
  type: Transaction | Transaction[];
}

const Tags = ({ type, ...rest }: { type: Transaction | Transaction[] }) =>
  Array.isArray(type) ? (
    <Box {...rest}>
      <Stack isInline spacing="tight">
        {type.map((t: Transaction) => (
          <Tag type={t} />
        ))}
      </Stack>
    </Box>
  ) : (
    <Tag type={type} {...rest} />
  );

const TitleDetail: React.FC<TitleProps> = ({ status, type, ...rest }) => {
  return (
    <Box {...rest}>
      <Stack isInline spacing="tight">
        <Tags type={type} />
        <Status status={status} />
      </Stack>
    </Box>
  );
};

export const TransactionTitle: React.FC<TitleProps> = ({ status, type, ...rest }) => (
  <Stack spacing="base" {...rest}>
    <Box>
      <Text textStyle="display.large" fontSize="36px">
        Transaction details
      </Text>
    </Box>
    <TitleDetail status={status} type={type} />
  </Stack>
);
