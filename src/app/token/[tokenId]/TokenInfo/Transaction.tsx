import { FlexProps } from '@chakra-ui/react';
import { FC } from 'react';

import { TxLink } from '../../../../common/components/ExplorerLinks';
import { useColorMode } from '../../../../components/ui/color-mode';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { StatSection } from '../../../_components/Stats/StatSection';

export const Transaction: FC<
  FlexProps & { txId: string; marketCapRank: number | null | undefined }
> = ({ marketCapRank, txId, ...flexProps }) => {
  const colorMode = useColorMode().colorMode;
  return (
    <StatSection
      title="Contract Transaction"
      bodyMainText={
        <Box
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
          color={`links.${colorMode}`}
          _hover={{ textDecoration: 'underline' }}
        >
          <TxLink txId={txId}>{txId}</TxLink>
        </Box>
      }
      bodySecondaryText={null}
      caption={
        <Flex fontSize={'12px'} fontWeight="500">
          Market Cap Rank: {marketCapRank || 'N/A'}
        </Flex>
      }
      {...flexProps}
    />
  );
};
