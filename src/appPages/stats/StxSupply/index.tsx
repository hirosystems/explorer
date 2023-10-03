import { numberToString } from '@/common/utils';
import { Flex, GridProps } from '@/ui/components';
import { Text } from '@/ui/typography';

import { SkeletonStatSection } from '../SkeletonStatSection';
import { StatSection } from '../StatSection';
import { useStxSupply } from './useStxSupply';

export function StxSupply(props: GridProps) {
  const { unlockedStx, totalStx, unlockedPercent, isFetching } = useStxSupply();
  if (isFetching) {
    return <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />;
  }
  return (
    <StatSection
      title="STX Supply"
      bodyMainText={numberToString(unlockedStx ? Number(unlockedStx) : 0)}
      bodySecondaryText={`/ ${numberToString(totalStx ? Number(totalStx) : 0)}`}
      caption={
        <Flex fontSize="12px" color="textTitle" fontWeight="500" alignItems="center">
          {Number(unlockedPercent || 0).toFixed(2)}%&nbsp;
          <Text fontSize="12px" color="textCaption">
            {' '}
            is unlocked
          </Text>
        </Flex>
      }
      {...props}
    />
  );
}
