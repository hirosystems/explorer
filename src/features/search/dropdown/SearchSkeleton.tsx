import { Flex, Spinner } from '@chakra-ui/react';

import { Circle } from '../../../common/components/Circle';
import { Skeleton } from '../../../ui/Skeleton';
import { Caption } from '../../../ui/typography';

export function SearchSkeleton() {
  return (
    <Flex py={6} gap={4} alignItems={'center'}>
      <Circle h={12} w={12}>
        <Spinner color={'textSubdued'} />
      </Circle>
      <Caption lineHeight="22px" wordBreak="break-word">
        <Skeleton width={'180px'} height={'12px'} />
      </Caption>
    </Flex>
  );
}
