import * as React from 'react';
import { Box, Flex, Text, ExclamationMarkCircleIcon, CloseIcon } from '@stacks/ui';
import { DialogCard } from '@components/dialog-card';

import { ErrorType } from '@components/search-bar/types';

const InlineError = ({ children, visible }: any) => (
  <Flex
    color="red"
    alignItems="center"
    pt="tight"
    transform={visible ? 'none' : 'translateY(5px)'}
    opacity={visible ? 1 : 0}
    style={{
      pointerEvents: visible ? 'all' : 'none',
    }}
    position={visible ? 'relative' : 'absolute'}
  >
    <Box mr="tight" size="18px">
      <ExclamationMarkCircleIcon />
    </Box>
    <Text>{children}</Text>
  </Flex>
);

const ErrorDropDown = ({ onClick, children, visible, ...rest }: any) => (
  <DialogCard
    position={'absolute'}
    width="100%"
    borderRadius="6px"
    alignItems="center"
    p="tight"
    mt="tight"
    flexDirection="row"
    justifyContent="space-between"
    zIndex={9999999999}
    transition="0.12s all ease-in-out"
    transform={visible ? 'none' : 'translateY(5px)'}
    opacity={visible ? 1 : 0}
    style={{
      pointerEvents: visible ? 'all' : 'none',
    }}
    {...rest}
  >
    <Flex alignItems="center">
      <Box color="red" mr="tight" size="18px">
        <ExclamationMarkCircleIcon />
      </Box>
      <Text fontSize="14px" fontWeight="500">
        {children}
      </Text>
    </Flex>
    <Box
      px="tight"
      color="ink.600"
      _hover={{
        cursor: 'pointer',
        opacity: 1,
      }}
      onClick={onClick}
      opacity={0.5}
    >
      <CloseIcon size="12px" />
    </Box>
  </DialogCard>
);

export const Error = ({
  error,
  clearError,
  small,
}: {
  error?: ErrorType;
  clearError?: () => void;
  small?: boolean;
}) =>
  small ? (
    <ErrorDropDown visible={error?.message} onClick={clearError}>
      {error?.message}
    </ErrorDropDown>
  ) : (
    <InlineError visible={error?.message}>{error?.message}</InlineError>
  );
