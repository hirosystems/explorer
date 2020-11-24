import React from 'react';
import { useHover, useFocus } from 'use-events';
import { FlexProps, Box, BoxProps, useEventListener, Flex, color, Stack } from '@stacks/ui';
import { Transaction } from '@models/transaction.interface';
import { TxItem } from '@components/transaction-item';
import { AddressLink, BlockLink, TxLink } from '@components/links';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { AllAccountData } from '@common/api/accounts';
import { ItemIcon } from '@components/item-icon';
import {
  addSepBetweenStrings,
  border,
  microToStacks,
  toRelativeTime,
  truncateMiddle,
} from '@common/utils';
import { Caption, Text, Title } from '@components/typography';
import { forwardRefWithAs } from '@stacks/ui-core';
import pluralize from 'pluralize';
import { FloatingHoverIndicator } from '@components/hover-indicator';

export interface RecentlyViewedProps extends FlexProps {
  transactions: Transaction[];
}

interface RecentlyViewedListItemProps extends BoxProps {
  option: Transaction | Block | ({ principal: string } & AllAccountData);
  isLast: boolean;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;
  onClick: (e?: any) => void;
  focused?: boolean;
  _type?: 'tx' | 'principal' | 'block';
}

const Wrapper = forwardRefWithAs<FlexProps & { isHovered?: boolean }, 'a'>(
  ({ children, as = 'a', isHovered, ...rest }, ref) => {
    return (
      <Flex
        as={as}
        p="loose"
        alignItems="center"
        borderBottom={border()}
        position="relative"
        justifyContent="space-between"
        ref={ref}
        {...rest}
      >
        <FloatingHoverIndicator isHovered={isHovered} left="0" />
        <Flex flexGrow={1} alignItems="center" justifyContent="space-between">
          {children}
        </Flex>
      </Flex>
    );
  }
);

export const RecentlyViewedListItem = ({
  option,
  isLast,
  onFocus,
  onBlur,
  focused,
  onClick,
  _type,
  ...rest
}: RecentlyViewedListItemProps) => {
  const [isHovered, bindHover] = useHover();
  const [isFocused, bindFocus] = useFocus();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [localFocus, setLocalFocus] = React.useState<boolean>(false);

  const handleFocus = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onFocus?.(e);
    bindFocus.onFocus(e as any);
  };

  const handleBlur = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onBlur?.(e);
    bindFocus.onBlur(e as any);
  };

  useEventListener('keydown', event => {
    if (event.key === 'Enter' && (focused || isFocused)) {
      onClick?.();
    }
  });

  React.useEffect(() => {
    if (focused && ref.current) {
      setLocalFocus(true);
      ref.current.focus?.();
      handleFocus();
    }
    if (!focused && localFocus && ref.current) {
      setLocalFocus(false);
      ref.current.blur?.();
      handleBlur();
    }
  }, [focused, ref]);

  const itemProps = {
    handleFocus,
    handleBlur,
    onClick,
    ...bindHover,
    isHovered,
  };

  if ('tx_id' in option) {
    return (
      <Box position="relative">
        <FloatingHoverIndicator isHovered={isHovered} left={0} />
        <TxLink txid={option.tx_id}>
          <TxItem
            borderBottom={isLast ? undefined : '1px solid var(--colors-border)'}
            {...bindHover}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex="0"
            {...(rest as any)}
            ref={ref}
            tx={option}
            isFocused={focused || isFocused}
            isHovered={isHovered}
            minimal
            px="loose"
            as="a"
            onClick={() => {
              onClick?.();
            }}
          />
        </TxLink>
      </Box>
    );
  }
  if ('principal' in option) {
    return (
      <AddressLink principal={option.principal}>
        <Wrapper {...itemProps}>
          <Flex alignItems="center">
            <ItemIcon type="principal" />
            <Box ml="base">
              <Title
                color={isHovered ? color('accent') : color('text-title')}
                display="block"
                mb="extra-tight"
              >
                {truncateMiddle(option.principal, 6)}
              </Title>
              <Caption>
                {addSepBetweenStrings([
                  `${microToStacks(option.balances?.stx?.balance)} STX`,
                  `${option?.transactions?.total} ${pluralize(
                    'transaction',
                    option?.transactions?.total
                  )}`,
                ])}
              </Caption>
            </Box>
          </Flex>
        </Wrapper>
      </AddressLink>
    );
  }
  if ('hash' in option) {
    return (
      <BlockLink hash={option.hash}>
        <Wrapper {...itemProps}>
          <Flex alignItems="center">
            <ItemIcon type="block" />
            <Stack spacing="tight" ml="base">
              <Title color={isHovered ? color('accent') : color('text-title')} display="block">
                Block #{option.height}
              </Title>
              <Caption>
                {addSepBetweenStrings([
                  `${option.txs.length} ${pluralize('transaction', option.txs.length)}`,
                ])}
              </Caption>
            </Stack>
          </Flex>
          <Stack textAlign="right" justifyContent="flex-end" spacing="tight">
            <Text ml="tight" fontSize="14px" textAlign="right" color={color('text-body')}>
              {toRelativeTime(option.burn_block_time * 1000)}
            </Text>
            <Caption>{truncateMiddle(option.hash)}</Caption>
          </Stack>
        </Wrapper>
      </BlockLink>
    );
  }
  return null;
};
