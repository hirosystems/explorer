'use client';

import type { NextPage } from 'next';

import { Sip10Disclaimer } from '../../common/components/Sip10Disclaimer';
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
