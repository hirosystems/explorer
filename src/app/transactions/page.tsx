'use client';

import { NextPage } from 'next';
import React from 'react';
import { BsChevronDown, BsCodeSlash } from 'react-icons/bs';
import { RxCube } from 'react-icons/rx';

import { numberToString } from '../../common/utils/utils';
import { TxListTabs } from '../../features/txs-list/tabs/TxListTabs';
import { Button } from '../../ui/Button';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Menu } from '../../ui/Menu';
import { MenuButton } from '../../ui/MenuButton';
import { MenuDivider } from '../../ui/MenuDivider';
import { MenuItem } from '../../ui/MenuItem';
import { MenuList } from '../../ui/MenuList';
import { Tag } from '../../ui/Tag';
import { TagLabel } from '../../ui/TagLabel';
import { useColorMode } from '../../ui/hooks/useColorMode';
import { FunctionIcon } from '../../ui/icons';
import { CubeSparkleIcon } from '../../ui/icons/CubeSparkleIcon';
import { PageTitle, PageTitleWithTags } from '../_components/PageTitle';
import { StatSection } from '../_components/Stats/StatSection';
import {
  CurrentStackingCycle,
  LastBlock,
  NextStackingCycle,
  StxSupply,
} from '../_components/Stats/Stats';
import { Wrapper } from '../_components/Stats/Wrapper';
import { LinksGroup } from '../token/[tokenId]/LinksGroup';
import { LinksMenu } from '../token/[tokenId]/LinksMenu';
import { Tabs } from '../token/[tokenId]/Tabs';
import { TokenInfo } from '../token/[tokenId]/TokenInfo';
import { MempoolFeeStats, MempoolFeeStatsWithErrorBoundary } from './MempoolFeeStats';

const TransactionsPage: NextPage = () => {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <MempoolFeeStatsWithErrorBoundary />
      <TxListTabs />
    </>
  );
};

export default TransactionsPage;
