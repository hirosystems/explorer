import { getNextPageParam } from '@/common/utils';
import { getStackingStartBlockHeight } from '@/common/utils/accounts';
import { TxLink } from '@/components/links';
import { PercentageCircle } from '@/components/percentage-circle';
import { Pending } from '@/components/status';
import { AddressQueryKeys, addressQK } from '@/features/address/query-keys';
import { useAddressQueries } from '@/features/address/use-address-queries';
import { TransactionQueryKeys, transactionQK } from '@/features/transaction/query-keys';
import { Box, Circle, Flex, Stack, TextLink } from '@/ui/components';
import { StxIcon } from '@/ui/icons/StxIcon';
import { Caption, Text, Title } from '@/ui/typography';
import * as React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

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
        <Box px="20px">
          <Stack spacing="8px" py="24px">
            <Caption>Stacking progress</Caption>
            <Flex alignItems="center">
              <Pending size="14px" mr="8px" />
              <Text color={'textTitle'}>Calculating...</Text>
            </Flex>
          </Stack>
        </Box>
      );
    }

    // "stx": {
    //   "balance": "20000000833049",
    //     "burnchain_lock_height": 793920,
    //     "burnchain_unlock_height": 802550,
    //     "lock_height": 108990,
    //     "lock_tx_id": "0x5d12e9d0c19cefa22ca6b954c518ddf390c1884704246d77ab78a0e54bbd9740",
    //     "locked": "20000000000000",
    //     "total_fees_sent": "0",
    //     "total_miner_rewards_received": "0",
    //     "total_received": "50239431333049",
    //     "total_sent": "30239430500000"
    // }

    const currentBlock = stacksInfo?.burn_block_height;
    const lockBlock = balances?.stx?.burnchain_lock_height;
    const unlockBlock = balances?.stx?.burnchain_unlock_height;

    const totalBlocksInStackingPeriod = unlockBlock - lockBlock;
    const blocksUntilUnlocked = unlockBlock - currentBlock;
    const blocksCompleted = totalBlocksInStackingPeriod - blocksUntilUnlocked;
    console.log('blocksCompleted', blocksCompleted);
    console.log('totalBlocksInStackingPeriod', totalBlocksInStackingPeriod);
    const stackingPercentage = (blocksCompleted / totalBlocksInStackingPeriod) * 100;

    const isStacking = unlockBlock > currentBlock;

    return (
      <Box mt="15px">
        <Caption>Stacking progress</Caption>
        <Stack spacing="8px" py="10px">
          {isStacking ? (
            <Box mx="auto" size="64px">
              <PercentageCircle percentage={stackingPercentage} />
            </Box>
          ) : (
            <Circle mx="auto" size="48px" mb="16px" bg={'invert'}>
              <StxIcon color={'bg'} size="24px" />
            </Circle>
          )}
          {isStacking ? (
            <Box mt="4px">
              <Box textAlign="center">
                <Caption mb="12px">
                  ~{blocksUntilUnlocked.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                  blocks remaining
                </Caption>
                <TxLink txid={balances?.stx?.lock_tx_id}>
                  <TextLink target="_blank" color={'brand'} fontSize={0}>
                    View Stacking transaction
                  </TextLink>
                </TxLink>
              </Box>
            </Box>
          ) : (
            <Box textAlign="center">
              <Title mb="12px" fontSize={2} fontWeight={500} color={'textTitle'}>
                Completed at #{unlockBlock}
              </Title>
              <TxLink txid={balances?.stx?.lock_tx_id}>
                <TextLink target="_blank" color={'brand'} fontSize={0}>
                  View Stacking transaction
                </TextLink>
              </TxLink>
            </Box>
          )}
        </Stack>
      </Box>
    );
  }
  return null;
};
