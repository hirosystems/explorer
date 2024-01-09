'use client';

import React from 'react';

import { Flex } from '../../ui/Flex';
import { SkeletonText } from '../../ui/SkeletonText';
import { Spinner } from '../../ui/Spinner';

export default function Skeleton() {
  return (
    <Flex width={'full'} p={6} alignItems={'center'} justifyContent={'center'}>
      <Spinner />
    </Flex>
  );
}
