import { Circle } from '../../../common/components/Circle';
import { Flex } from '../../../ui/Flex';
import { Skeleton } from '../../../ui/Skeleton';
import { Spinner } from '../../../ui/Spinner';
import { Caption } from '../../../ui/typography';

export function SearchSkeleton() {
  return (
    <Flex py={6} gap={4} alignItems={'center'}>
      <Circle size={12}>
        <Spinner color={'textSubdued'} />
      </Circle>
      <Caption lineHeight="22px" wordBreak="break-word">
        <Skeleton width={'180px'} height={'12px'} />
      </Caption>
    </Flex>
  );
}
