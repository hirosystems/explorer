import { AddressQueryKeys, addressQK } from '@features/address/query-keys';
import { useAddressQueries } from '@features/address/use-address-queries';
import { TransactionQueryKeys, transactionQK } from '@features/transaction/query-keys';
import * as React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

import { Box, Circle, Flex, Stack, StxInline, color } from '@stacks/ui';

import { getNextPageParam } from '@common/utils';
import { getStackingStartBlockHeight } from '@common/utils/accounts';

import { TxLink } from '@components/links';
import { PercentageCircle } from '@components/percentage-circle';
import { Pending } from '@components/status';
import { Caption, Link, Text, Title } from '@components/typography';

export const StackingPercentage = ({ balances, address }: any) => {
  const queries = useAddressQueries();
  const { data: stacksInfo } = useQuery(
    addressQK(AddressQueryKeys.coreApiInfo),
    queries.fetchCoreApiInfo()
  );
  const { data } = useInfiniteQuery(
    transactionQK(TransactionQueryKeys.transactionsForAddress, address),
    ({ pageParam }) => queries.fetchTransactionsForAddress(address, undefined, pageParam || 0)(),
    { getNextPageParam }
  );
  const stackingStartBlock = getStackingStartBlockHeight(data?.pages?.[0]?.results);

  if (stackingStartBlock) {
    if (!stacksInfo) {
      return (
        <Box px="base-loose">
          <Stack spacing="tight" py="loose">
            <Caption>Stacking progress</Caption>
            <Flex alignItems="center">
              <Pending size="14px" mr="tight" />
              <Text color={color('text-title')}>Calculating...</Text>
            </Flex>
          </Stack>
        </Box>
      );
    }

    const currentBlock = stacksInfo?.burn_block_height;
    const lockBlock = balances?.stx?.burnchain_lock_height;
    const unlockBlock = balances?.stx?.burnchain_unlock_height;

    const totalBlocksInStackingPeriod = unlockBlock - lockBlock;
    const blocksUntilUnlocked = unlockBlock - currentBlock;
    const blocksCompleted = totalBlocksInStackingPeriod - blocksUntilUnlocked;
    const stackingPercentage = (blocksCompleted / totalBlocksInStackingPeriod) * 100;

    const isStacking = unlockBlock > currentBlock;

    return (
      <Box px="base-loose">
        <Stack spacing="tight" py="loose">
          {isStacking ? (
            <Box mx="auto" size="64px">
              <PercentageCircle strokeWidth={3} percentage={stackingPercentage} />
            </Box>
          ) : (
            <Circle mx="auto" size="48px" mb="base" bg={color('invert')}>
              <StxInline color={color('bg')} size="24px" />
            </Circle>
          )}
          <Caption mx="auto">Stacking progress</Caption>
          {isStacking ? (
            <Box mt="extra-tight">
              <Flex position="relative" mb="base-tight" justifyContent="center" alignItems="center">
                <Title fontSize={2} fontWeight={500} color={color('text-title')}>
                  {stackingPercentage.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
                  completed
                </Title>
              </Flex>
              <Box textAlign="center">
                <Caption mb="base-tight">
                  ~{blocksUntilUnlocked.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                  blocks remaining
                </Caption>
                <TxLink txid={balances?.stx?.lock_tx_id}>
                  <Link target="_blank" color={color('brand')} fontSize={0}>
                    View Stacking transaction
                  </Link>
                </TxLink>
              </Box>
            </Box>
          ) : (
            <Box textAlign="center">
              <Title mb="base-tight" fontSize={2} fontWeight={500} color={color('text-title')}>
                Completed at #{unlockBlock}
              </Title>
              <TxLink txid={balances?.stx?.lock_tx_id}>
                <Link target="_blank" color={color('brand')} fontSize={0}>
                  View Stacking transaction
                </Link>
              </TxLink>
            </Box>
          )}
        </Stack>
      </Box>
    );
  }
  return null;
};
