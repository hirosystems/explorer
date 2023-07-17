import { numberToString } from '@/common/utils';
import { Flex, GridProps } from '@/ui/components';
import { FC } from 'react';
import { StatSection } from '@/app/stats/StatSection';

export const Supply: FC<
  GridProps & { circulatingSupply: number | null; totalSupply: number | null }
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
