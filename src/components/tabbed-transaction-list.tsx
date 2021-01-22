import * as React from 'react';
import { Box, BoxProps, Flex, color, Stack, Spinner, transition } from '@stacks/ui';
import { Section } from '@components/section';
import { capitalize } from '@common/utils';
import { Caption } from '@components/typography';
import { atomFamily, useRecoilState } from 'recoil';
import { memo, useCallback, useState, useMemo } from 'react';

import { useHover } from 'web-api-hooks';
import { SECTION_HEADER_HEIGHT } from '@common/constants/sizes';
import { SectionFooterAction } from '@components/section-footer-button';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';

import { TransactionListItem } from '@components/transaction-list-item';
import { FilterButton } from '@components/filter-button';
import { InfiniteQueryObserverBaseResult } from 'react-query';
import { useFetchTransactions } from '@common/hooks/data/use-fetch-transactions';

const TX_TABS = 'tabs/tx-list';

const tabIndexState = atomFamily({
  key: 'tabs.index',
  default: 0,
});

const useTabs = (key: string) => {
  const [currentIndex, setCurrentIndex] = useRecoilState(tabIndexState(key));

  return {
    currentIndex,
    setCurrentIndex,
  };
};

interface TabProps extends BoxProps {
  tab: string;
  index: number;
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

const Tab: React.FC<TabProps> = memo(({ tab, index, _hover = {}, ...rest }) => {
  const [isHovered, bind] = useHover();
  const { currentIndex, setCurrentIndex } = useTabs(TX_TABS);
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

const Tabs = memo(() => {
  const tabs = ['pending', 'confirmed'];
  return (
    <Stack isInline spacing="0">
      {tabs.map((tab, index) => (
        <Tab tab={tab} index={index} key={index} />
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
  data: {
    pages: Pages[];
    pageParams: (number | undefined)[];
  };
}

function getUniqueListBy<T>(arr: T[], key: keyof T): T[] {
  return ([...new Map(arr.map(item => [item[key], item])).values()] as unknown) as T[];
}

const TransactionList = memo<TransactionListProps>(props => {
  const { data, limit } = props;
  const results = data.pages.reduce<Item[]>(
    (accumulator, value) => accumulator.concat(value.results),
    []
  );

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
});

export const TabbedTransactionList: React.FC<{
  mempool: any;
  confirmed: any;
  infinite?: boolean;
}> = ({ mempool: mempoolOptions, confirmed: confirmedOptions, infinite }) => {
  const [loading, setLoading] = useState(false);
  const { currentIndex } = useTabs(TX_TABS);
  const mempoolSelected = currentIndex === 0;

  const confirmed = useFetchTransactions({
    ...confirmedOptions,
  });
  const mempool = useFetchTransactions({
    ...mempoolOptions,
    mempool: true,
  });

  const currentList: InfiniteQueryObserverBaseResult = mempoolSelected ? mempool : confirmed;

  const { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = currentList;

  const handleFooterClick = useCallback(async () => {
    setLoading(true);
    await fetchNextPage();
    setLoading(false);
  }, [mempoolSelected, fetchNextPage, setLoading]);

  return (
    <Section
      title={Tabs}
      headerProps={{
        pl: '0',
      }}
      alignSelf="flex-start"
      isLoading={isFetching}
      topRight={!mempoolSelected && infinite && FilterButton}
    >
      <Flex flexGrow={1} flexDirection="column" px="base-loose">
        <Box display={mempoolSelected ? 'unset' : 'none'} position="relative">
          <TransactionList
            data={mempool?.data}
            key={'mempool'}
            limit={!infinite && mempoolOptions.limit}
          />
        </Box>
        <Box display={!mempoolSelected ? 'unset' : 'none'} position="relative">
          <TransactionList
            data={confirmed?.data}
            key={'confirmed'}
            limit={!infinite && confirmedOptions.limit}
          />
        </Box>
        {/*<Box flexGrow={1} />*/}
        <SectionFooterAction
          path="transactions"
          isLoading={isFetchingNextPage || loading}
          onClick={handleFooterClick}
          hasNextPage={hasNextPage}
          showLoadMoreButton={infinite}
        />
      </Flex>
    </Section>
  );
};
