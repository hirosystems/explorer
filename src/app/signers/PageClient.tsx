'use client';

import { TxListTabs } from '../../features/txs-list/tabs/TxListTabs';
import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import { SignersWithErrorBoundary } from './Signers';

export default function () {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Signers</PageTitle>
      </Flex>
      <SignersWithErrorBoundary />
      <TxListTabs />
    </>
  );
}
