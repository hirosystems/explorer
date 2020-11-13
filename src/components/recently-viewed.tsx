import React from 'react';
import { useHover, useFocus } from 'use-events';
import { FlexProps, Box, BoxProps, useEventListener, Flex, color } from '@stacks/ui';
import { Transaction } from '@models/transaction.interface';
import { TxItem } from '@components/transaction-item';
import { AddressLink, BlockLink, TxLink } from '@components/links';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { AllAccountData } from '@common/fetchers';
import { ItemIcon } from '@components/item-icon';
import {
  addSepBetweenStrings,
  border,
  microToStacks,
  toRelativeTime,
  truncateMiddle,
} from '@common/utils';
import { Caption, Title } from '@components/typography';
import { forwardRefWithAs } from '@stacks/ui-core';
import pluralize from 'pluralize';

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

const Wrapper = forwardRefWithAs<FlexProps, 'a'>(({ children, as = 'a', ...rest }, ref) => (
  <Flex
    _hover={{
      bg: color('bg-alt'),
    }}
    as={as}
    p="base"
    alignItems="center"
    borderBottom={border()}
    ref={ref}
    {...rest}
  >
    {children}
  </Flex>
));

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
  };

  if ('tx_id' in option) {
    return (
      <Box>
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
            _hover={{
              bg: color('bg-alt'),
            }}
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
          <ItemIcon type="principal" />
          <Box ml="base">
            <Title display="block" mb="extra-tight">
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
        </Wrapper>
      </AddressLink>
    );
  }
  if ('hash' in option) {
    return (
      <BlockLink hash={option.hash}>
        <Wrapper {...itemProps}>
          <ItemIcon type="block" />
          <Box ml="base">
            <Title display="block" mb="extra-tight">
              Block #{option.height}
            </Title>
            <Caption>
              {addSepBetweenStrings([
                truncateMiddle(option.hash),
                `${option.txs.length} ${pluralize('transaction', option.txs.length)}`,
                toRelativeTime(option.burn_block_time * 1000),
              ])}
            </Caption>
          </Box>
        </Wrapper>
      </BlockLink>
    );
  }
  return null;
};
