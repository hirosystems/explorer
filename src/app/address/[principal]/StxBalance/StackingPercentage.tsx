'use client';

import * as React from 'react';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { TxLink } from '../../../../common/components/ExplorerLinks';
import { PercentageCircle } from '../../../../common/components/PercentageCircle';
import { Pending } from '../../../../common/components/status';
import { useAddressConfirmedTxsWithTransfersInfinite } from '../../../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { useCoreApiInfo } from '../../../../common/queries/useCoreApiInfo';
import { getStackingStartBlockHeight } from '../../../../common/utils/accounts';
import { Box } from '../../../../ui/Box';
import { Circle } from '../../../../ui/Circle';
import { Flex } from '../../../../ui/Flex';
import { Stack } from '../../../../ui/Stack';
import { TextLink } from '../../../../ui/TextLink';
import { StxIcon } from '../../../../ui/icons';
import { Caption, Text, Title } from '../../../../ui/typography';

export const StackingPercentage = ({
  balance,
  address,
}: {
  balance: AddressBalanceResponse;
  address: string;
}) => {
  const { data: stacksInfo } = useCoreApiInfo();
  const { data } = useAddressConfirmedTxsWithTransfersInfinite(address);
  const firstPageTxs = data?.pages?.[0]?.results.map(txWithTransfers => txWithTransfers.tx);
  const stackingStartBlock = getStackingStartBlockHeight(firstPageTxs);

  console.log('stackingStartBlock', stackingStartBlock);
  console.log('data', data?.pages);

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

    const currentBlock = stacksInfo?.burn_block_height;
    const lockBlock = balance?.stx?.burnchain_lock_height;
    const unlockBlock = balance?.stx?.burnchain_unlock_height;

    const totalBlocksInStackingPeriod = unlockBlock - lockBlock;
    const blocksUntilUnlocked = unlockBlock - currentBlock;
    const blocksCompleted = totalBlocksInStackingPeriod - blocksUntilUnlocked;
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
                <TxLink txId={balance?.stx?.lock_tx_id}>
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
              <TxLink txId={balance?.stx?.lock_tx_id}>
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
