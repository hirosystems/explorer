'use client';

import { Sip10Disclaimer } from '../../common/components/Sip10Disclaimer';
import type { NextPage } from 'next';

import { PageTitle } from '../_components/PageTitle';
import { TokensList } from './TokensList/TokensList';

const TokensPage: NextPage = () => (
  <>
    <PageTitle>Token Tracker</PageTitle>
    <TokensList />
    <Sip10Disclaimer />
  </>
);

export default TokensPage;
