'use client';

import { Flex, Spinner } from '@chakra-ui/react';

export default function Skeleton() {
  return (
    <Flex width={'full'} p={6} alignItems={'center'} justifyContent={'center'}>
      <Spinner />
    </Flex>
  );
}
