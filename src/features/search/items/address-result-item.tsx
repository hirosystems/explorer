import { useApi } from '@/common/api/client';
import { FoundResult } from '@/common/types/search-results';
import { microToStacks, truncateMiddle } from '@/common/utils';
import { AddressLink } from '@/components/links';
import { ResultItemWrapper } from '@/features/search/items/result-item-wrapper';
import { Box, Circle, Flex } from '@/ui/components';
import { WalletIcon } from '@/ui/icons';
import { Caption, Title } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';

import { AddressStxBalanceResponse } from '@stacks/stacks-blockchain-api-types';

interface AddressResultItemProps {
  result: FoundResult;
}

export const AddressResultItem: React.FC<AddressResultItemProps> = ({ result }) => {
  const principal = result.result.entity_id;
  const displayName =
    result.result.entity_type === 'standard_address' ? result.result.display_name : '';
  const truncatedPrincipal = truncateMiddle(principal, 4);
  const { accountsApi } = useApi();
  const { data: stxBalance } = useQuery(
    ['stx-balance', principal],
    () => accountsApi.getAccountStxBalance({ principal }) as Promise<AddressStxBalanceResponse>,
    { staleTime: 3 * 60 * 1000 }
  );
  const colorMode = useColorMode().colorMode;
  return (
    <AddressLink principal={principal}>
      <ResultItemWrapper>
        <Flex alignItems="center">
          <Circle>
            <WalletIcon size="16px" />
          </Circle>
          <Box ml="16px">
            <Title
              display="block"
              mb="4px"
              className={'search-result-title'}
              color={`links.${colorMode}`}
            >
              {displayName ? `${displayName} (${truncatedPrincipal})` : truncatedPrincipal}
            </Title>
            <Caption>{`${microToStacks(stxBalance?.balance || 0)} STX`}</Caption>
          </Box>
        </Flex>
      </ResultItemWrapper>
    </AddressLink>
  );
};
