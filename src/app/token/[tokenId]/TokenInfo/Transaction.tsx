import { truncateMiddle } from '@/common/utils/utils';
import { Box, Flex, StackProps } from '@chakra-ui/react';
import { FC } from 'react';

import { TxLink } from '../../../../common/components/ExplorerLinks';
import { StatSection } from '../../../_components/Stats/StatSection';

export const Transaction: FC<
  StackProps & { txId: string; marketCapRank: number | null | undefined }
> = ({ marketCapRank, txId, ...stackProps }) => {
  return (
    <StatSection
      title="Contract Transaction"
      bodyMainText={
        <Box
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
          color={'text'}
          _hover={{ textDecoration: 'underline' }}
        >
          <TxLink txId={txId}>{truncateMiddle(txId, 4)}</TxLink>
        </Box>
      }
      bodySecondaryText={null}
      caption={
        <Flex fontSize={'xs'} fontWeight="500">
          Market Cap Rank: {marketCapRank || 'N/A'}
        </Flex>
      }
      {...stackProps}
    />
  );
};
