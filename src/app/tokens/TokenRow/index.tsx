import { Icon } from '@chakra-ui/react';
import { FtBasicMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { SealCheck, Warning } from '@phosphor-icons/react';
import { FC } from 'react';

import { TokenLink, TxLink } from '../../../common/components/ExplorerLinks';
import { abbreviateNumber, getFtDecimalAdjustedBalance } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Td } from '../../../ui/Td';
import { Text } from '../../../ui/Text';
import { Tr } from '../../../ui/Tr';
import { TokenAvatar } from '../../address/[principal]/TokenBalanceCard/TokenAvatar';
import { getHasSBTCInName, getIsSBTC } from '../utils';

export const TokenRow: FC<{
  ftToken: FtBasicMetadataResponse;
}> = ({ ftToken }) => {
  const name = ftToken.name || 'FT Token';

  const hasSBTCInName = getHasSBTCInName(name, ftToken.symbol ?? '');
  const isSBTC = getIsSBTC(ftToken.contract_principal);

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
          {hasSBTCInName ? (
            isSBTC ? (
              <Flex
                px={1.5}
                py={1}
                bg="green.300"
                borderRadius="2xl"
                border="1px solid var(--stacks-colors-green-500)"
              >
                <Icon as={SealCheck} h={3} w={3} color="green.600" />
              </Flex>
            ) : (
              <Flex
                px={1.5}
                py={1}
                bg="red.200"
                borderRadius="2xl"
                border="1px solid var(--stacks-colors-red-500)"
              >
                <Icon as={Warning} h={3} w={3} color="red.600" />
              </Flex>
            )
          ) : null}
        </Flex>
      </Td>
      <Td padding={'10px'} display={['none', 'none', 'table-cell']}>
        <Text fontSize={'15px'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'}>
          <TxLink txId={ftToken.tx_id}>{ftToken.tx_id}</TxLink>
        </Text>
      </Td>
      <Td isNumeric width={'130px'} padding={'10px 16px 10px 20px'}>
        <Text whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflow={'hidden'} fontSize={'15px'}>
          {ftToken.total_supply
            ? abbreviateNumber(
                getFtDecimalAdjustedBalance(ftToken.total_supply, ftToken.decimals || 0),
                2
              )
            : 'N/A'}
        </Text>
      </Td>
    </Tr>
  );
};
