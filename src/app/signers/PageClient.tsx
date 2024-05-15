'use client';

import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import { SignersHeader } from './SignersHeader';
import SignersTable from './SignersTable';

export default function ({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Signers</PageTitle>
      </Flex>
      <SignersHeader tokenPrice={tokenPrice} />
      <SignersTable />
    </>
  );
}
