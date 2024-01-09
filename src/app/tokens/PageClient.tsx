'use client';

import type { NextPage } from 'next';
import * as React from 'react';

import { PageTitle } from '../_components/PageTitle';
import { TokensList } from './TokensList/TokensList';

const TokensPage: NextPage = () => (
  <>
    <PageTitle>Token Tracker</PageTitle>
    <TokensList />
  </>
);

export default TokensPage;
