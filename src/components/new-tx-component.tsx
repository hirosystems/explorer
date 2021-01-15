import * as React from 'react';
import { Box, Flex } from '@stacks/ui';

import { TxList } from '@components/transaction-list';

import { Section } from '@components/section';
import { useState } from 'react';
import { border, capitalize } from '@common/utils';
import { Caption } from '@components/typography';
import { atomFamily, useRecoilState } from 'recoil';

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

const Tabs = () => {
  const tabs = ['pending', 'confirmed'];
  const { currentIndex, setCurrentIndex } = useTabs(TX_TABS);
  const currentTab = tabs[currentIndex];

  return (
    <Flex borderBottom={border()}>
      {tabs.map((tab, index) => (
        <Box p="base" onClick={() => setCurrentIndex(index)} key={index}>
          <Caption>{capitalize(tab)}</Caption>
        </Box>
      ))}
    </Flex>
  );
};

export const HomeTxs = ({ confirmed, mempool }: any) => {
  const { currentIndex } = useTabs(TX_TABS);
  const dataInView = currentIndex === 0 ? mempool : confirmed;
  return (
    <Section title="Transactions">
      <Tabs />
      <Box px="base-loose">
        <TxList items={dataInView} />
      </Box>
    </Section>
  );
};
