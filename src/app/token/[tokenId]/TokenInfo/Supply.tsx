import { FC } from 'react';

import { numberToString } from '../../../../common/utils/utils';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { StatSection } from '../../../_components/Stats/StatSection';

export const Supply: FC<
  FlexProps & {
    circulatingSupply: number | null | undefined;
    totalSupply: number | null | undefined;
  }
> = ({ circulatingSupply, totalSupply, ...flexProps }) => {
  return (
    <StatSection
      title="Circulating Supply"
      bodyMainText={circulatingSupply ? numberToString(circulatingSupply) : <>N/A</>}
      bodySecondaryText={null}
      caption={
        <Flex fontSize={'12px'} color={'textTitle'} fontWeight="500" alignItems={'center'}>
          Total Supply: {totalSupply ? numberToString(totalSupply) : 'N/A'}
        </Flex>
      }
      {...flexProps}
    />
  );
};
