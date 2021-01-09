import React from 'react';
import { useHover, useFocus } from 'use-events';
import {
  FlexProps,
  Box,
  BoxProps,
  useEventListener,
  Flex,
  color,
  Stack,
  Spinner,
} from '@stacks/ui';
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
import { FetchTransactionResponse } from '@common/api/transactions';
import { useItem } from '@common/hooks/search/use-item';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { usePrevious } from '@common/hooks/search/use-previous';
import { SearchResult } from '@common/types/search';
import { useSearchDropdown } from '@common/hooks/search/use-search-dropdown';

interface SearchResultItemProps extends BoxProps {
  option: FetchTransactionResponse | Block | ({ principal: string } & AllAccountData);
  principal?: string;
  isLast: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onClick?: (e?: any) => void;
  focused?: boolean;
  _type?: 'tx' | 'principal' | 'block';
}

const Wrapper = forwardRefWithAs<FlexProps & { isHovered?: boolean; isLast: boolean }, 'a'>(
  ({ children, as = 'a', isHovered, isLast, ...rest }, ref) => {
    return (
      <Flex
        as={as}
        p="loose"
        alignItems="center"
        borderBottom={!isLast ? border() : 'unset'}
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

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  option,
  isLast,
  onFocus,
  onBlur,
  focused,
  onClick,
  _type,
  principal,
  ...rest
}) => {
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
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick,
    isLast,
    ...bindHover,
    isHovered,
  };

  if (!option) {
    return null;
  }
  if ('transaction' in option) {
    return (
      <TxLink txid={option.transaction.tx_id}>
        <Wrapper {...itemProps} p={0}>
          <TxItem
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex="0"
            ref={ref}
            tx={option.transaction}
            isFocused={focused || isFocused}
            isHovered={isHovered}
            minimal
            px="loose"
            onClick={() => {
              onClick?.();
            }}
          />
        </Wrapper>
      </TxLink>
    );
  } else if ('balances' in option) {
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
  } else if ('hash' in option) {
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
  } else {
    return null;
  }
};

export const SearchCardItem: React.FC<{
  recentItem?: SearchResult;
  clearResults?: () => void;
  onClick?: () => any;
  isLast: boolean;
}> = React.memo(({ recentItem, onClick, clearResults, isLast }) => {
  const [item, loading] = useItem(recentItem);
  const { data } = usePrevious();
  const { handleUpsertItem } = useRecentlyViewedItems();
  const { handleMakeHidden } = useSearchDropdown();

  return loading ? (
    <Flex
      borderBottom={isLast ? border() : 'unset'}
      alignItems="center"
      p="extra-loose"
      height="96px"
      bg={color('bg')}
      width="100%"
    >
      <Spinner size="sm" color={color('text-caption')} />
    </Flex>
  ) : (
    <SearchResultItem
      option={item}
      onClick={() => {
        onClick?.();
        clearResults?.();
        handleMakeHidden();
        (data || recentItem)?.found ? handleUpsertItem(data || recentItem) : null;
      }}
      isLast={isLast}
    />
  );
});
