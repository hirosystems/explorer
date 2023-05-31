'use client';

import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@/common/constants';
import { useGlobalContext } from '@/common/context/useAppContext';
import { Grid } from '@/ui/Grid';
import { Title } from '@/ui/typography';
import * as React from 'react';
import { FC } from 'react';

import { DefaultTxListTabs } from './common/components/tx-lists/tabs/DefaultTxListTabs';
import { BlocksList } from './components/BlockList';
import { Stats } from './stats/Stats';

export const HomeClientBase: FC = () => {
  console.log('[DEBUG] rendering home');
  const { activeNetwork } = useGlobalContext();
  return (
    <Grid mt="32px" gap="32px" width="100%" gridTemplateColumns={['100%', '100%', '0.6fr 0.4fr']}>
      <Title
        as="h1"
        fontSize="36px"
        display="block"
        width="100%"
        textAlign={['center', 'left']}
        mt="40px"
        mb="0"
        data-test="homepage-title"
        color="white"
        gridColumnStart={'1'}
        gridColumnEnd={['2', '2', '3']}
      >
        Stacks Explorer
      </Title>
      {!activeNetwork.isSubnet && <Stats />}
      <DefaultTxListTabs limit={DEFAULT_LIST_LIMIT_SMALL} />
      <BlocksList limit={DEFAULT_BLOCKS_LIST_LIMIT} />
    </Grid>
  );
};

export default HomeClientBase;

export const HomeClient = HomeClientBase;
