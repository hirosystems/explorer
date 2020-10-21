import * as React from 'react';

import { Box, CloseIcon, ExclamationMarkCircleIcon, Flex, FlexProps } from '@stacks/ui';
import { Link, Pre, Text, Title } from '@components/typography';

import { AlertTriangleIcon } from './icons/alert-triangle';
import { border } from '@common/utils';
import { color } from '@components/color-modes';
import { useClearErrors } from '@common/hooks/use-clear-errors';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

interface ReasonData {
  expected?: number | string;
}

enum ErrorReasons {
  FeeTooLow = 'FeeTooLow',
  NotEnoughFunds = 'NotEnoughFunds',
  NoSuchContract = 'NoSuchContract',
  ContractAlreadyExists = 'ContractAlreadyExists',
  BadNonce = 'BadNonce',
}

interface RenderErrorMessageOptions {
  reason: ErrorReasons;
  reason_data?: ReasonData;
  txid?: string;
}

export const renderErrorMessage = ({
  reason,
  reason_data,
  txid,
}: RenderErrorMessageOptions): JSX.Element | string => {
  switch (reason) {
    case ErrorReasons.NoSuchContract:
      return (
        <>
          Contract not found. Please{' '}
          <Link
            as="a"
            color="var(--colors-accent)"
            _hover={{
              cursor: 'pointer',
            }}
            href="https://github.com/blockstack/explorer/issues/new"
            target="_blank"
          >
            file an issue
          </Link>{' '}
          for this. <Pre>{txid}</Pre>
        </>
      );
    case ErrorReasons.BadNonce:
      return 'There is a pending transaction, please wait until your previous transaction has completed.';
    case ErrorReasons.ContractAlreadyExists:
      return 'A contract with this name already exists at your address. Please change the contract name and try again.';
    case ErrorReasons.FeeTooLow:
      return `Fee was too low, expected ${reason_data?.expected || 'a different amount of'} uSTX.`;
    case ErrorReasons.NotEnoughFunds:
      return `Not enough funds at address provided, expected ${
        reason_data?.expected ? BigInt(reason_data?.expected).toString() : 'a different amount of'
      } uSTX.`;
  }
};

interface AlertError {
  name?: string;
  message?: string;
}

interface AlertProps {
  error?: AlertError | string;
  clearError?: () => void;
  showClearErrors?: boolean;
}

const getFormattedError = (error: AlertError | string): AlertError => {
  if (typeof error === 'string') {
    return { name: 'Error', message: error };
  }
  return error;
};

export const Alert: React.FC<AlertProps & FlexProps> = ({
  error: _error,
  clearError,
  showClearErrors,
  ...rest
}) => {
  const clearErrors = useClearErrors();
  const { error } = useSandboxState();
  const formattedError: AlertError | null = error
    ? {
        name: error?.name || 'Error',
        message: error?.message || error,
      }
    : _error
    ? getFormattedError(_error)
    : null;

  const hasError = error || _error;

  return formattedError && hasError ? (
    <Flex
      borderRadius="12px"
      border={border()}
      alignItems="center"
      color="#F9A14D"
      bg={color('bg')}
      {...rest}
    >
      <Flex
        borderRadius="12px 0 0 12px"
        bg={color('bg')}
        py="tight"
        pl="base"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        alignSelf="stretch"
      >
        <AlertTriangleIcon size="24px" mr="tight" color="red" />
        {error || _error ? (
          <Title
            fontSize="14px"
            as="h4"
            my="0"
            fontWeight={500}
            style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
          >
            {formattedError.name}
          </Title>
        ) : null}
      </Flex>
      <Flex alignItems="center" width="100%" py="tight" px="base-tight" pr="none">
        <Box>
          <Text fontSize="14px" pl="tight" color={color('text-body')} fontWeight={500}>
            {_error
              ? formattedError?.message
              : error?.name === 'Status 429'
              ? 'Too many requests to the faucet, try again later.'
              : error?.message || renderErrorMessage(error)}
          </Text>
        </Box>
        {clearError || showClearErrors ? (
          <Box
            opacity={0.5}
            _hover={{
              cursor: 'pointer',
              opacity: 1,
            }}
            px="base"
            ml="auto"
            color={color('text-body')}
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
        ) : null}
      </Flex>
    </Flex>
  ) : null;
};
