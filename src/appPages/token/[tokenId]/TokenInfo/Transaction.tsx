import { useColorMode } from '@chakra-ui/react';
import { Box, Flex, GridProps } from '@/ui/components';
import { TxLink } from '@/components/links';
import { numberToString } from '@/common/utils';
import { StatSection } from '@/appPages/stats/StatSection';

export function Transaction({
  tvl,
  txId,
  ...gridProps
}: GridProps & { txId: string; tvl: number | null }) {
  const { colorMode } = useColorMode();
  return (
    <StatSection
      title="Contract transaction"
      bodyMainText={
        <Box
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          color={`links.${colorMode}`}
          _hover={{ textDecoration: 'underline' }}
        >
          <TxLink txId={txId}>{txId}</TxLink>
        </Box>
      }
      bodySecondaryText={null}
      caption={
        <Flex fontSize="12px" color="textCaption" fontWeight="500">
          TVL: {tvl ? `$${numberToString(tvl)}` : 'N/A'}
        </Flex>
      }
      {...gridProps}
    />
  );
}
