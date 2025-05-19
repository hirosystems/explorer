'use client';

import { Flex } from '@chakra-ui/react';

import { PageTitle } from '../_components/PageTitle';
import { SignersHeader } from './SignersHeader';
import SignersTable from './SignersTable';

export default function () {
  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Signers</PageTitle>
      </Flex>
      <SignersHeader />
      <SignersTable />
    </>
  );
}
