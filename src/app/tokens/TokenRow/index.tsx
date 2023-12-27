import { useColorMode } from '@chakra-ui/react';
import { FtBasicMetadataResponse } from '@hirosystems/token-metadata-api-client';
import React, { FC } from 'react';

import { TokenLink, TxLink } from '../../../common/components/ExplorerLinks';
import { numberToString } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Td } from '../../../ui/Td';
import { Text } from '../../../ui/Text';
import { Tr } from '../../../ui/Tr';
import { TokenAvatar } from '../../address/[principal]/TokenBalanceCard/TokenAvatar';

export const TokenRow: FC<{
  ftToken: FtBasicMetadataResponse;
}> = ({ ftToken }) => {
  const colorMode = useColorMode().colorMode;
  const name = ftToken.name || 'FT Token';
  // `${ftToken.contract_principal}::${name}`
  return (
    <Tr>
      <Td padding={'10px 20px 10px 16px'} width={['auto', 'auto', '30%']}>
        <Flex alignItems={'center'} gap={'8px'}>
          <TokenAvatar metadataImageUrl={ftToken.image_uri} asset={ftToken.symbol || 'FT'} />
          <TokenLink
            tokenId={ftToken.contract_principal}
            fontSize={'sm'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
          >
            {name} {ftToken.symbol ? `(${ftToken.symbol})` : null}
          </TokenLink>
        </Flex>
      </Td>
      <Td padding={'10px'} display={['none', 'none', 'table-cell']}>
        <Text fontSize={'15px'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
          <TxLink txId={ftToken.tx_id}>{ftToken.tx_id}</TxLink>
        </Text>
      </Td>
      <Td isNumeric width={'130px'} padding={'10px 16px 10px 20px'}>
        <Text whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'} fontSize={'15px'}>
          {numberToString(ftToken.total_supply ? Number(ftToken.total_supply) : 0)}
        </Text>
      </Td>
    </Tr>
  );
};
