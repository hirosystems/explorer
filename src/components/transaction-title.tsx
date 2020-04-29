import * as React from 'react';
import { Box, Stack, BoxProps } from '@blockstack/ui';

import { Status, Statuses } from '@components/status';
import { Tag } from '@components/tags';
import { Title } from '@components/typography';

import { TransactionType } from '@models/transaction.interface';

export interface TitleProps extends BoxProps {
  status: Statuses;
  type: TransactionType | TransactionType[];
  contractName?: string;
}

const Tags = ({ type, ...rest }: { type: TransactionType | TransactionType[] }) =>
  Array.isArray(type) ? (
    <Box {...rest}>
      <Stack isInline spacing="tight">
        {type.map((t: TransactionType, key) => (
          <Tag type={t} key={key} />
        ))}
      </Stack>
    </Box>
  ) : (
    <Tag type={type} {...rest} />
  );

const TitleDetail = ({ status, type, ...rest }: TitleProps) => (
  <Box {...rest}>
    <Stack isInline spacing="tight">
      <Tags type={type} />
      <Status status={status} />
    </Stack>
  </Box>
);

export const TransactionTitle = ({ status, type, ...rest }: TitleProps) => (
  <Stack spacing="base" {...rest}>
    <Box>
      <Title as="h1" textStyle="display.large" fontSize="36px">
        Transaction details
      </Title>
    </Box>
    <TitleDetail status={status} type={type} />
  </Stack>
);
