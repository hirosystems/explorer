import * as React from 'react';
import { FC, ReactNode, memo, useCallback, useState } from 'react';

import { Box, Flex } from '@stacks/ui';

import { FilterButton } from '@components/filter-button';
import { SkeletonGenericTransactionList } from '@components/loaders/skeleton-transaction';
import { Section } from '@components/section';

import { TabsTitleProps, TabsWrapper } from '@modules/Tabs/TabsWrapper';
import { Tabs } from '@modules/TransactionList/components/Tabs';

import { useTransactionList } from '../hooks/useTransactionList';
import { MempoolTxsList, TxsList } from './TxsList';

const Title: FC<TabsTitleProps> = ({ currentIndex, setCurrentIndex }) => (
  <Tabs
    tabs={['confirmed', 'pending']}
    currentIndex={currentIndex}
    setCurrentIndex={setCurrentIndex}
  />
);

const TxsListWithTabs: React.FC<{
  limit: number;
  infinite?: boolean;
}> = ({ limit, infinite }) => {
  console.log('[debug] rendering TxsListWithTabs');
  const [currentIndex, setCurrentIndex] = useState(0);
  const mempoolSelected = currentIndex !== 0;
  const { confirmedTransactionsResponse, mempoolTransactionsResponse } = useTransactionList(limit);

  if (mempoolSelected && mempoolTransactionsResponse.data)
    return (
      <TabsWrapper
        setCurrentIndex={setCurrentIndex}
        currentIndex={currentIndex}
        TopRight={!mempoolSelected ? FilterButton : undefined}
        Title={Title}
      >
        <MempoolTxsList
          response={mempoolTransactionsResponse}
          showFooter
          infinite={infinite}
          limit={limit}
        />
      </TabsWrapper>
    );

  if (!mempoolSelected && confirmedTransactionsResponse.data)
    return (
      <TabsWrapper
        setCurrentIndex={setCurrentIndex}
        currentIndex={currentIndex}
        TopRight={!mempoolSelected ? FilterButton : undefined}
        Title={Title}
      >
        <TxsList
          response={confirmedTransactionsResponse}
          showFooter
          infinite={infinite}
          limit={limit}
        />
      </TabsWrapper>
    );

  return (
    <TabsWrapper
      setCurrentIndex={setCurrentIndex}
      currentIndex={currentIndex}
      TopRight={!mempoolSelected ? FilterButton : undefined}
      Title={Title}
    >
      <SkeletonGenericTransactionList />
    </TabsWrapper>
  );
};

export const TxsListWithTabsMemoized = memo(TxsListWithTabs);
