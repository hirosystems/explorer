import { useColorMode } from '@chakra-ui/react';
import { FC } from 'react';

import { TxLink } from '../../../../common/components/ExplorerLinks';
import { numberToString } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { StatSection } from '../../../_components/Stats/StatSection';

export const Transaction: FC<GridProps & { txId: string; tvl: number | null | undefined }> = ({
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
        <Flex fontSize={'12px'} fontWeight="500">
          TVL: {tvl ? `$${numberToString(tvl)}` : 'N/A'}
        </Flex>
      }
      {...gridProps}
    />
  );
};
