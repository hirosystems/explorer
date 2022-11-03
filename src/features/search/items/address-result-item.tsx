import React from 'react';
import { Box, Flex } from '@stacks/ui';
import { FoundResult } from '@common/types/search-results';
import { microToStacks, truncateMiddle } from '@common/utils';
import { AddressLink } from '@components/links';
import { ItemIcon } from '@components/item-icon';
import { Caption, Title } from '@components/typography';
import { ResultItemWrapper } from '@features/search/items/result-item-wrapper';
import { useApi } from '@common/api/client';
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
  return (
    <AddressLink principal={principal}>
      <ResultItemWrapper>
        <Flex alignItems="center">
          <ItemIcon type="principal" />
          <Box ml="base">
            <Title display="block" mb="extra-tight" className={'search-result-title'}>
              {displayName ? `${displayName} (${truncatedPrincipal})` : truncatedPrincipal}
            </Title>
            <Caption>{`${microToStacks(stxBalance?.balance || 0)} STX`}</Caption>
          </Box>
        </Flex>
      </ResultItemWrapper>
    </AddressLink>
  );
};
