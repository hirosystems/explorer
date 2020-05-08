import * as React from 'react';
import { Box, Flex } from '@blockstack/ui';
import { Title, Text } from '@components/typography';
import { ExclamationMarkCircleIcon } from '@components/svg';
import { useDebugState } from '@common/debug';

const renderErrorMessage = ({
  reason,
  reason_data,
}: {
  reason: 'FeeTooLow' | 'NotEnoughFunds';
  reason_data: any;
}) => {
  switch (reason) {
    case 'FeeTooLow':
      return `Fee was too low, expected ${reason_data?.expected} uSTX.`;
    case 'NotEnoughFunds':
      return `Not enough funds at address provided, expected ${BigInt(
        reason_data?.expected
      ).toString()} uSTX.`;
  }
};

export const Alert = ({ error: _error, ...rest }: any) => {
  const { error } = useDebugState();
  const hasError = error || _error;
  return hasError ? (
    <Flex
      p="base"
      borderRadius="6px"
      border="1px solid var(--colors-border)"
      align="center"
      color="#F9A14D"
      {...rest}
    >
      <Box mr="tight">
        <ExclamationMarkCircleIcon />
      </Box>
      <Box>
        {error ? (
          <Title as="h4" style={{ textTransform: 'capitalize' }}>
            {error?.error || error?.name}:{' '}
          </Title>
        ) : null}
        <Text pl="tight">{_error ? _error : error?.message || renderErrorMessage(error)}</Text>
      </Box>
    </Flex>
  ) : null;
};
