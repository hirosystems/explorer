import * as React from 'react';
import { Box, Flex, Text, color, ExclamationMarkCircleIcon } from '@stacks/ui';
import { DialogCard } from '@components/dialog-card';
import CloseIcon from 'mdi-react/CloseIcon';

import { ErrorType } from '@components/search-bar/types';
import { IconButton } from '@components/icon-button';
import { Alert } from '@components/alert';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';

export const InlineError = ({ children, visible }: any) => (
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
    p="base"
    mt="tight"
    flexDirection="row"
    justifyContent="space-between"
    zIndex={9999999999}
    transition="0.12s all ease-in-out"
    transform={visible ? 'none' : 'translateY(5px)'}
    opacity={visible ? 1 : 0}
    bg={color('bg')}
    borderColor={color('border')}
    style={{
      pointerEvents: visible ? 'all' : 'none',
    }}
    wordBreak="break-word"
    {...rest}
  >
    <Flex alignItems="center">
      <AlertTriangleIcon mr="tight" color={color('feedback-error')} />
      <Text fontSize="14px" fontWeight="400" color={color('text-body')} lineHeight="22px">
        {children}
      </Text>
    </Flex>
    <IconButton flexShrink={0} dark icon={CloseIcon} onClick={onClick} />
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
