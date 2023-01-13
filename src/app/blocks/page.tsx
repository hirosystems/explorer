'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import { Flex } from '@/ui/components';
import type { NextPage } from 'next';
import * as React from 'react';

import { BlocksList } from '../components/BlockList';

const BlocksPage: NextPage = () => (
  <Flex direction={'column'}>
    <PageTitle>Blocks</PageTitle>
    <BlocksList />
  </Flex>
);

export default BlocksPage;
