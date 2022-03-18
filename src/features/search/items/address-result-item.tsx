import React from 'react';
import { Box, Flex } from '@stacks/ui';
import { FoundResult } from '@common/types/search-results';
import { useAtomValue } from 'jotai/utils';
import { accountStxBalanceResponseState, accountTransactionsState } from '@store/accounts';
import { useInfiniteQueryAtom } from 'jotai-query-toolkit';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { addSepBetweenStrings, microToStacks, truncateMiddle } from '@common/utils';
import pluralize from 'pluralize';
import { AddressLink } from '@components/links';
import { ItemIcon } from '@components/item-icon';
import { Caption, Title } from '@components/typography';
import { ResultItemWrapper } from '@features/search/items/result-item-wrapper';
import { TransactionsListResponse } from '@store/transactions';
import { InfiniteData } from 'react-query';

interface AddressResultItemProps {
  result: FoundResult;
}
export const AddressResultItem: React.FC<AddressResultItemProps> = ({ result }) => {
  if (!result || !result.found || result.result.entity_type !== 'standard_address') return null;
  const principal = result.result.entity_id;
  const stx = useAtomValue(accountStxBalanceResponseState(principal));
  const [transactions] = useInfiniteQueryAtom<InfiniteData<TransactionsListResponse> | undefined>(
    accountTransactionsState([principal, DEFAULT_LIST_LIMIT])
  );
  const transactionTotal = transactions?.pages?.[0]?.total;
  const caption = addSepBetweenStrings([
    `${microToStacks(stx.balance)} STX`,
    `${transactionTotal} ${pluralize('transaction', transactionTotal)}`,
  ]);
  return (
    <AddressLink principal={principal}>
      <ResultItemWrapper>
        <Flex alignItems="center">
          <ItemIcon type="principal" />
          <Box ml="base">
            <Title display="block" mb="extra-tight" className={'search-result-title'}>
              {truncateMiddle(principal, 4)}
            </Title>
            <Caption>{caption}</Caption>
          </Box>
        </Flex>
      </ResultItemWrapper>
    </AddressLink>
  );
};
