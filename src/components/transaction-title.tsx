import * as React from 'react';

import { Box, BoxProps, Stack, StackProps, color } from '@stacks/ui';
import { Status, Statuses } from '@components/status';
import { Tag, TagProps } from '@components/tags';

import { Title } from '@components/typography';
import { TransactionType } from '@models/transaction.interface';

export interface TitleProps {
  status: Statuses;
  type: TransactionType | TransactionType[];
  contractName?: string;
}

const Tags = ({ type, ...rest }: { type: TransactionType | TransactionType[] } & BoxProps) =>
  Array.isArray(type) ? (
    <Box {...rest}>
      <Stack isInline spacing="tight">
        {type.map((t: TransactionType, key) => (
          <Tag color="white" bg="rgba(255,255,255,0.24)" type={t} key={key} />
        ))}
      </Stack>
    </Box>
  ) : (
    <Tag
      color="white"
      bg="rgba(255,255,255,0.24)"
      type={type}
      {...(rest as Omit<TagProps, 'type'>)}
    />
  );

const TitleDetail = ({ status, type, contractName, ...rest }: TitleProps & BoxProps) => (
  <Box {...rest}>
    <Stack isInline spacing="tight">
      <Tags type={type} />
      <Status status={status} />
    </Stack>
  </Box>
);

export const TransactionTitle = ({
  status,
  type,
  contractName,
  ...rest
}: TitleProps & StackProps) => (
  <Stack spacing="base" {...rest}>
    <Title as="h1" fontSize="36px" color="white" mt="72px">
      Transaction details
    </Title>
    <TitleDetail status={status} type={type} />
  </Stack>
);
