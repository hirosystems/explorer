'use client';

import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';
import { SignersWithErrorBoundary } from './Signers';
import SignersGrid from './SignersGrid';

export default function () {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Signers</PageTitle>
      </Flex>
      <SignersWithErrorBoundary />
      <SignersGrid />
    </>
  );
}
