import { FaBitcoin } from 'react-icons/fa';
import { useApi } from '@/common/api/client';
import { Circle } from '@/components/circle';
import { Box, Flex, GridProps, Icon } from '@/ui/components';
import { Text } from '@/ui/typography';

import { useBlockListInfinite } from '../../common/queries/useBlockListInfinite';
import { SkeletonStatSection } from '../SkeletonStatSection';
import { StatSection } from '../StatSection';

export function LastBlock(props: GridProps) {
  const api = useApi();
  const { data: blocks, isFetching } = useBlockListInfinite(api);
  const lastBlockHeight = blocks?.pages?.[0]?.results?.[0]?.height;
  const lastBurnBlockHeight = blocks?.pages?.[0]?.results?.[0]?.burn_block_height;
  const lastBlockTxsCount = blocks?.pages?.[0]?.results?.[0]?.txs?.length;

  if (isFetching) {
    return <SkeletonStatSection borderRightWidth={['0px', '0px', '0px', '1px']} />;
  }

  return (
    <StatSection
      title="Last Block"
      bodyMainText={`#${lastBlockHeight}`}
      bodySecondaryText={
        <Flex alignItems="center">
          <Circle size={18} mr="3px">
            <Icon as={FaBitcoin} color="icon" size={18} />
          </Circle>
          {lastBurnBlockHeight}
        </Flex>
      }
      caption={
        <Box fontSize="12px" color="textCaption" fontWeight="500">
          <Text color="textTitle" display="inline-block">
            {lastBlockTxsCount}
          </Text>{' '}
          transaction
          {lastBlockTxsCount !== 1 ? 's' : ''}
        </Box>
      }
      {...props}
    />
  );
}
