import * as React from 'react';
import { Box, Flex, ExclamationMarkCircleIcon, CloseIcon } from '@blockstack/ui';
import { Title, Text, Pre } from '@components/typography';
import { useClearErrors } from '@common/hooks/use-clear-errors';
import { useSandboxState } from '@common/sandbox';

export const renderErrorMessage = ({
  reason,
  reason_data,
  txid,
}: {
  reason: 'FeeTooLow' | 'NotEnoughFunds' | 'NoSuchContract';
  reason_data: any;
  txid?: string;
}) => {
  switch (reason) {
    case 'NoSuchContract':
      return (
        <>
          Contract not found. Please{' '}
          <Text
            as="a"
            color="var(--colors-accent)"
            _hover={{
              cursor: 'pointer',
            }}
            // @ts-ignore
            href="https://github.com/blockstack/explorer/issues/new"
            target="_blank"
          >
            file an issue
          </Text>{' '}
          for this. <Pre>{txid}</Pre>
        </>
      );
    case 'FeeTooLow':
      return `Fee was too low, expected ${reason_data?.expected} uSTX.`;
    case 'NotEnoughFunds':
      return `Not enough funds at address provided, expected ${BigInt(
        reason_data?.expected
      ).toString()} uSTX.`;
  }
};

export const Alert = ({ error: _error, clearError, ...rest }: any) => {
  const clearErrors = useClearErrors();
  const { error } = useSandboxState();
  const hasError = error || _error;
  return hasError ? (
    <Flex
      borderRadius="6px"
      border="1px solid var(--colors-border)"
      align="center"
      color="#F9A14D"
      {...rest}
    >
      <Flex
        borderRadius="6px 0 0 6px"
        bg="var(--colors-bg-alt)"
        p="base"
        align="center"
        justify="center"
        flexGrow={1}
        borderRight="1px solid var(--colors-border)"
        alignSelf="stretch"
      >
        <Box mr="tight" color="red">
          <ExclamationMarkCircleIcon size="20px" />
        </Box>
        {error || _error ? (
          <Title as="h4" style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {error?.error ? error?.error : error?.name ? error?.name : 'Error!'}
          </Title>
        ) : null}
      </Flex>
      <Flex align="center" width="100%" p="base" pr="none">
        <Box>
          <Text pl="tight">{_error ? _error : error?.message || renderErrorMessage(error)}</Text>
        </Box>
        <Box
          opacity={0.5}
          _hover={{
            cursor: 'pointer',
            opacity: 1,
          }}
          px="base"
          ml="auto"
          color="var(--colors-text-caption)"
          role="button"
          title="Clear error"
          aria-label="Clear error"
          onClick={() => {
            clearErrors();
            clearError && clearError();
          }}
        >
          <CloseIcon size="12px" />
        </Box>
      </Flex>
    </Flex>
  ) : null;
};
