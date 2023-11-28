'use client';

import type { NextPage } from 'next';
import * as React from 'react';

import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import { TokensList } from './TokensList/TokensList';

const TokensPage: NextPage = () => (
  <Flex direction={'column'} mt="32px" gap="32px">
    <PageTitle>Token Tracker</PageTitle>
    <TokensList />
  </Flex>
);

export default TokensPage;
