import * as React from 'react';

import { Circle } from '../../../common/components/Circle';
import { Flex } from '../../../ui/Flex';
import { SkeletonItem } from '../../../ui/SkeletonItem';
import { Spinner } from '../../../ui/Spinner';
import { Caption } from '../../../ui/typography';

export function SearchSkeleton() {
  return (
    <Flex py={6} gap={4} alignItems={'center'}>
      <Circle size={12}>
        <Spinner color={'textSubdued'} />
      </Circle>
      <Caption lineHeight="22px" wordBreak="break-word">
        <SkeletonItem width={'180px'} height={'12px'} />
      </Caption>
    </Flex>
  );
}
