'use client';

import { useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { Circle } from '../../../../common/components/Circle';
import { TxLink } from '../../../../common/components/ExplorerLinks';
import { useAddressConfirmedTxsWithTransfersInfinite } from '../../../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { useCoreApiInfo } from '../../../../common/queries/useCoreApiInfo';
import { getStackingStartBlockHeight } from '../../../../common/utils/accounts';
import { Box } from '../../../../ui/Box';
import { CircularProgress } from '../../../../ui/CircularProgress';
import { CircularProgressLabel } from '../../../../ui/CircularProgressLabel';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { TextLink } from '../../../../ui/TextLink';
import { StxIcon } from '../../../../ui/icons';
import { Caption, Title } from '../../../../ui/typography';

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
  const progressColor = useColorModeValue('brand', 'purple.400');

  if (stackingStartBlock) {
    if (!stacksInfo) {
      return (
        <Stack gap={2} py={4}>
          <Caption>Stacking progress</Caption>
          <Stack gap={2} alignItems="center">
            <CircularProgress isIndeterminate color={progressColor} />
            <Caption>Calculating...</Caption>
          </Stack>
        </Stack>
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
      <Stack gap={2} py={4}>
        <Caption>Stacking progress</Caption>
        <Stack gap={2} alignItems="center">
          {isStacking ? (
            <CircularProgress value={stackingPercentage} color={progressColor} size={'180px'}>
              <CircularProgressLabel>{`${Math.round(stackingPercentage)}%`}</CircularProgressLabel>
            </CircularProgress>
          ) : (
            <Circle mx="auto" size="48px" mb="16px" bg={'invert'}>
              <Icon as={StxIcon} size={'24px'} color="white" />
            </Circle>
          )}
          {isStacking ? (
            <Stack gap={2} alignItems="center">
              <Caption mb="12px">
                ~{blocksUntilUnlocked.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                blocks remaining
              </Caption>
              <TxLink txId={balance?.stx?.lock_tx_id} target="_blank" fontSize={'xs'}>
                View Stacking transaction
              </TxLink>
            </Stack>
          ) : (
            <Box textAlign="center">
              <Title mb="12px" fontSize={2} fontWeight={'medium'} color={'textTitle'}>
                Completed at #{unlockBlock}
              </Title>
              <TxLink txId={balance?.stx?.lock_tx_id} target="_blank" fontSize={'xs'}>
                View Stacking transaction
              </TxLink>
            </Box>
          )}
        </Stack>
      </Stack>
    );
  }
  return null;
};
