import { Box, Flex, GridProps } from '@/ui/components';
import { FC } from 'react';
import { TxLink } from '@/components/links';
import { useColorMode } from '@chakra-ui/react';
import { numberToString } from '@/common/utils';
import { StatSection } from '@/app/stats/StatSection';

export const Transaction: FC<GridProps & { txId: string; tvl: number | null }> = ({
  tvl,
  txId,
  ...gridProps
}) => {
  const colorMode = useColorMode().colorMode;
  return (
    <StatSection
      title="Contract transaction"
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
        <Flex fontSize={'12px'} color={'textCaption'} fontWeight="500">
          TVL: {tvl ? `$${numberToString(tvl)}` : 'N/A'}
        </Flex>
      }
      {...gridProps}
    />
  );
};
