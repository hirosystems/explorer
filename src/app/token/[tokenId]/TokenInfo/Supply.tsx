import { FC } from 'react';

import { numberToString } from '../../../../common/utils/utils';
import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { StatSection } from '../../../_components/Stats/StatSection';

export const Supply: FC<
  GridProps & {
    circulatingSupply: number | null | undefined;
    totalSupply: number | null | undefined;
  }
> = ({ circulatingSupply, totalSupply, ...gridProps }) => {
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
      {...gridProps}
    />
  );
};
