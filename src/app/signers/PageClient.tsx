'use client';

import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import SignersGrid from './SignersGrid';
import { SignersHeaderWithErrorBoundary } from './SignersHeader';

export default function () {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Signers</PageTitle>
      </Flex>
      <SignersHeaderWithErrorBoundary />
      <SignersGrid />
    </>
  );
}
