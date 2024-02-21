'use client';

import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import { SignersHeaderWithErrorBoundary } from './SignersHeader';
import SignersTable from './SignersTable';

export default function () {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Signers</PageTitle>
      </Flex>
      <SignersHeaderWithErrorBoundary />
      <SignersTable />
    </>
  );
}
