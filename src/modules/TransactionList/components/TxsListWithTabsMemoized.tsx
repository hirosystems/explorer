import { FilterButton } from '@components/filter-button';
import { Section } from '@components/section';
import { Tabs } from '@modules/TransactionList/components/Tabs';
import { Box, Flex } from '@stacks/ui';
import * as React from 'react';
import { FC, memo, useCallback, useState } from 'react';
import { SkeletonGenericTransactionList } from '@components/loaders/skeleton-transaction';
import { MempoolTxsList, TxsList } from './TxsList';
import { useTransactionList } from '../hooks/useTransactionList';

const Title: FC<{ currentIndex: number; setCurrentIndex: (val: number) => void }> = ({
  currentIndex,
  setCurrentIndex,
}) => (
  <Tabs
    tabs={['confirmed', 'pending']}
    currentIndex={currentIndex}
    setCurrentIndex={setCurrentIndex}
  />
);

const Wrapper: FC<{
  currentIndex: number;
  setCurrentIndex: (val: number) => void;
  mempoolSelected: boolean;
}> = ({ setCurrentIndex, currentIndex, mempoolSelected, children }) => (
  <Section
    title={memo(() => (
      <Title currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
    ))}
    headerProps={{ pl: '0' }}
    alignSelf="flex-start"
    topRight={!mempoolSelected && FilterButton}
  >
    <Flex flexGrow={1} flexDirection="column" px="base-loose">
      <Box position="relative">{children}</Box>
    </Flex>
  </Section>
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
      <Wrapper
        setCurrentIndex={setCurrentIndex}
        currentIndex={currentIndex}
        mempoolSelected={mempoolSelected}
      >
        <MempoolTxsList
          response={mempoolTransactionsResponse}
          showFooter
          infinite={infinite}
          limit={limit}
        />
      </Wrapper>
    );

  if (!mempoolSelected && confirmedTransactionsResponse.data)
    return (
      <Wrapper
        setCurrentIndex={setCurrentIndex}
        currentIndex={currentIndex}
        mempoolSelected={mempoolSelected}
      >
        <TxsList
          response={confirmedTransactionsResponse}
          showFooter
          infinite={infinite}
          limit={limit}
        />
      </Wrapper>
    );

  return (
    <Wrapper
      setCurrentIndex={setCurrentIndex}
      currentIndex={currentIndex}
      mempoolSelected={mempoolSelected}
    >
      <SkeletonGenericTransactionList />
    </Wrapper>
  );
};

export const TxsListWithTabsMemoized = memo(TxsListWithTabs);
