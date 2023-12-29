'use client';

import React from 'react';

import { Flex } from '../../ui/Flex';
import { SkeletonText } from '../../ui/SkeletonText';

export default function Loading() {
  return (
    <Flex mt={46} width={'full'} p={6}>
      <SkeletonText noOfLines={30} spacing={4} width={'100%'} />
    </Flex>
  );
}
