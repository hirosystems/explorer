import React from 'react';
import { Box, Flex } from '@stacks/ui';
import { FoundResult } from '@common/types/search-results';
import { useAtomValue } from 'jotai/utils';
import { accountStxBalanceResponseState } from '@store/accounts';
import { microToStacks, truncateMiddle } from '@common/utils';
import { AddressLink } from '@components/links';
import { ItemIcon } from '@components/item-icon';
import { Caption, Title } from '@components/typography';
import { ResultItemWrapper } from '@features/search/items/result-item-wrapper';

interface AddressResultItemProps {
  result: FoundResult;
}
export const AddressResultItem: React.FC<AddressResultItemProps> = ({ result }) => {
  if (!result || !result.found || result.result.entity_type !== 'standard_address') return null;
  const principal = result.result.entity_id;
  const displayName = result.result.display_name;
  const truncatedPrincipal = truncateMiddle(principal, 4);
  const stx = useAtomValue(accountStxBalanceResponseState(principal));
  return (
    <AddressLink principal={principal}>
      <ResultItemWrapper>
        <Flex alignItems="center">
          <ItemIcon type="principal" />
          <Box ml="base">
            <Title display="block" mb="extra-tight" className={'search-result-title'}>
              {displayName ? `${displayName} (${truncatedPrincipal})` : truncatedPrincipal}
            </Title>
            <Caption>{`${microToStacks(stx.balance)} STX`}</Caption>
          </Box>
        </Flex>
      </ResultItemWrapper>
    </AddressLink>
  );
};
