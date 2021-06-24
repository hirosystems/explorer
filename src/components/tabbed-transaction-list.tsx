import * as React from 'react';
import { Box, BoxProps, Flex, color, Stack, transition } from '@stacks/ui';
import { Section } from '@components/section';
import { capitalize } from '@common/utils';
import { Caption } from '@components/typography';
import { atomFamily, useRecoilState } from 'recoil';
import { memo, useCallback, useState, useMemo } from 'react';

import { useHover } from 'web-api-hooks';
import { SECTION_HEADER_HEIGHT } from '@common/constants/sizes';
import { SectionFooterAction } from '@components/section-footer-button';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TransactionListItem } from '@components/transaction-list-item';
import { FilterButton } from '@components/filter-button';
import {
  useMempoolTransactionsListState,
  useTransactionsListState,
} from '../hooks/use-transactions-list-state';

const TX_TABS = 'tabs/tx-list';

interface TabIndexState {
  key: string;
  defaultIndex?: number;
}

const tabIndexState = atomFamily<number, Readonly<TabIndexState>>({
  key: 'tabs.index',
  default: 0,
  effects_UNSTABLE: param => [
    ({ trigger, setSelf }) => {
      if (trigger === 'get') {
        setSelf(param.defaultIndex || 0);
      }
    },
  ],
});

const useTabs = (key: string, defaultIndex?: number) => {
  const [currentIndex, setCurrentIndex] = useRecoilState(tabIndexState({ key, defaultIndex }));

  return {
    currentIndex,
    setCurrentIndex,
  };
};

interface TabProps extends BoxProps {
  tab: string;
  index: number;
  defaultIndex?: number;
}

interface TabIndicatorProps extends BoxProps {
  isHovered?: boolean;
  isActive?: boolean;
}

const TabActiveIndicator: React.FC<TabIndicatorProps> = memo(({ isHovered, isActive, ...rest }) => (
  <Box
    height="1px"
    width="100%"
    opacity={isActive ? 0.75 : isHovered ? 1 : 0}
    bg={color(isActive ? 'text-title' : 'brand')}
    position="absolute"
    bottom="-1px"
    transform={isActive || isHovered ? 'none' : 'scaleX(0)'}
    transition={transition}
    {...rest}
  />
));

const Tab: React.FC<TabProps> = memo(({ tab, index, _hover = {}, defaultIndex, ...rest }) => {
  const [isHovered, bind] = useHover();
  const { currentIndex, setCurrentIndex } = useTabs(TX_TABS, defaultIndex);
  const isActive = index === currentIndex;
  const hoverProps = isActive
    ? {
        ..._hover,
      }
    : {
        cursor: 'pointer',
        color: color('brand'),
        ..._hover,
      };
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      outline={0}
      border={0}
      px="base-loose"
      bg="transparent"
      onClick={() => setCurrentIndex(index)}
      color={isActive ? color('text-title') : color('text-caption')}
      _hover={hoverProps}
      position="relative"
      height={SECTION_HEADER_HEIGHT}
      {...bind}
      {...rest}
    >
      <Caption opacity={isActive ? 1 : 0.85} fontSize={2} fontWeight={500} color="currentColor">
        {capitalize(tab)}{' '}
        <Box as="span" display={['none', 'none', 'inline']}>
          transactions
        </Box>
      </Caption>
      <TabActiveIndicator isActive={isActive} isHovered={isHovered} />
    </Box>
  );
});

const Tabs = memo(({ defaultIndex }: { defaultIndex?: number }) => {
  const tabs = ['pending', 'confirmed'];
  return (
    <Stack isInline spacing="0">
      {tabs.map((tab, index) => (
        <Tab defaultIndex={defaultIndex} tab={tab} index={index} key={index} />
      ))}
    </Stack>
  );
});
type Item = MempoolTransaction | Transaction;

export interface Pages {
  limit: number;
  offset: number;
  total: number;
  results: Item[];
}

interface TransactionListProps {
  limit?: number;
  data: Pages;
}

function getUniqueListBy<T>(arr: T[], key: keyof T): T[] {
  return [...new Map(arr.map(item => [item[key], item])).values()] as unknown as T[];
}

const TransactionList = (props: TransactionListProps) => {
  const { data, limit } = props;
  const { results } = data;
  const list = useMemo(() => getUniqueListBy<Item>(results, 'tx_id'), [results]);
  return (
    <>
      {list?.map((item: Item, itemIndex: number) =>
        limit && itemIndex + 1 > limit ? null : (
          <TransactionListItem
            tx={item}
            key={item.tx_id}
            isLast={
              limit && list.length >= limit
                ? itemIndex + 1 === limit
                : itemIndex + 1 === list.length
            }
          />
        )
      )}
    </>
  );
};

export const TabbedTransactionList: React.FC<{
  limit?: number;
  infinite?: boolean;
}> = ({ limit, infinite }) => {
  const confirmedPages = useTransactionsListState(limit);
  const mempoolPages = useMempoolTransactionsListState(limit);

  const [loading, setLoading] = useState(false);
  // if there are no mempool transactions, default to confirmed
  const defaultIndex = mempoolPages.pages[0]?.results.length === 0 ? 1 : 0;
  const { currentIndex } = useTabs(TX_TABS, 0);
  const mempoolSelected = currentIndex === 0;

  const handleFooterClick = useCallback(() => {
    setLoading(true);

    setLoading(false);
  }, [mempoolSelected, setLoading]);

  return (
    <Section
      title={() => <Tabs defaultIndex={defaultIndex} />}
      headerProps={{
        pl: '0',
      }}
      alignSelf="flex-start"
      topRight={!mempoolSelected && infinite && FilterButton}
    >
      <Flex flexGrow={1} flexDirection="column" px="base-loose">
        <Box display={mempoolSelected ? 'unset' : 'none'} position="relative">
          <TransactionList limit={limit} data={mempoolPages.pages[0]} key={'mempool'} />
        </Box>
        <Box display={!mempoolSelected ? 'unset' : 'none'} position="relative">
          <TransactionList limit={limit} data={confirmedPages.pages[0]} key={'confirmed'} />
        </Box>
        <SectionFooterAction
          path="transactions"
          isLoading={loading}
          onClick={handleFooterClick}
          showLoadMoreButton={infinite}
        />
      </Flex>
    </Section>
  );
};
