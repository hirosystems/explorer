import { numberToString } from '@/common/utils';
import { Flex, GridProps } from '@/ui/components';
import { Text } from '@/ui/typography';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC } from 'react';

import { SkeletonStatSection } from '../SkeletonStatSection';
import { StatSection } from '../StatSection';
import { useStxSupply } from './useStxSupply';

const StxSupplyBase: FC<GridProps> = props => {
  const { unlockedStx, totalStx, unlockedPercent } = useStxSupply();
  return (
    <StatSection
      title="STX Supply"
      bodyMainText={numberToString(unlockedStx ? Number(unlockedStx) : 0)}
      bodySecondaryText={`/ ${numberToString(totalStx ? Number(totalStx) : 0)}`}
      caption={
        <Flex fontSize={'12px'} color={'textTitle'} fontWeight="500" alignItems={'center'}>
          {Number(unlockedPercent || 0).toFixed(2)}%&nbsp;
          <Text fontSize={'12px'} color={'textCaption'}>
            {' '}
            is unlocked
          </Text>
        </Flex>
      }
      {...props}
    />
  );
};

export default StxSupplyBase;

export const StxSupply = dynamic(() => import('.'), {
  loading: () => <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />,
  ssr: false,
});
