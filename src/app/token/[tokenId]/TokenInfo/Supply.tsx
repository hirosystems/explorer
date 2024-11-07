import { Flex, StackProps } from '@chakra-ui/react';
import { FC } from 'react';

import { abbreviateNumber } from '../../../../common/utils/utils';
import { StatSection } from '../../../_components/Stats/StatSection';

export const Supply: FC<
  StackProps & {
    circulatingSupply: number | null | undefined;
    totalSupply: number | null | undefined;
  }
> = ({ circulatingSupply, totalSupply, ...stackProps }) => {
  return (
    <StatSection
      title="Circulating Supply"
      bodyMainText={circulatingSupply ? abbreviateNumber(circulatingSupply) : <>N/A</>}
      bodySecondaryText={null}
      caption={
        <Flex fontSize={'xs'} color={'textSubdued'} fontWeight="medium" alignItems={'center'}>
          Total Supply: {totalSupply ? abbreviateNumber(totalSupply) : 'N/A'}
        </Flex>
      }
      {...stackProps}
    />
  );
};
