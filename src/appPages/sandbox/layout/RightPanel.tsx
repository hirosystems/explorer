import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';
import { MdOutlineLogout } from 'react-icons/md';
import { SkeletonRightPanel } from '@/appPages/sandbox/layout/SkeletonRightPanel';
import { useAppSelector } from '@/common/state/hooks';
import { microToStacks, truncateMiddle } from '@/common/utils';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { IconButton } from '@/ui/IconButton';
import { Stack } from '@/ui/Stack';
import { Tooltip } from '@/ui/Tooltip';
import { StxIcon } from '@/ui/icons/StxIcon';
import { Caption, Text } from '@/ui/typography';

import { TransactionsPanel } from '../components/TransactionsPanel';
import { useUser } from '../hooks/useUser';
import { selectShowRightPanel } from '../sandbox-slice';

function RightPanelBase(props: { children?: ReactNode }) {
  const { isConnected, disconnect, stxAddress, transactions, mempoolTransactions, balance } =
    useUser();
  const showRightPanel = useAppSelector(selectShowRightPanel);
  if (!showRightPanel || !isConnected) return null;

  return (
    <Flex flexGrow={1} flexDirection="column" borderLeftWidth="1px">
      {balance ? (
        <Box bg="bg" borderBottomWidth="1px" p="24px">
          <Stack spacing="16px">
            <Stack textAlign="right">
              <Caption>Account balance</Caption>
              <Flex
                flexShrink={0}
                flexGrow={1}
                alignItems="center"
                position="relative"
                justifyContent="flex-end"
                color="textTitle"
                gap="8px"
              >
                <StxIcon strokeWidth={2} color="currentColor" size="18px" />
                <Text fontWeight={600} fontSize="24px" display="block" position="relative">
                  {balance?.stx?.balance ? microToStacks(balance.stx.balance) : 0} STX
                </Text>
              </Flex>
            </Stack>
            {stxAddress && (
              <Flex textAlign="right" justifyContent="flex-end" alignItems="center">
                <Caption _hover={{ cursor: 'pointer' }}>{truncateMiddle(stxAddress, 12)}</Caption>
                <Box
                  _hover={{ cursor: 'pointer' }}
                  onClick={() => {
                    disconnect();
                  }}
                  position="relative"
                  ml="8px"
                >
                  <Tooltip placement="bottom" label="Sign out">
                    <IconButton
                      size="20px"
                      color="textBody"
                      icon={<MdOutlineLogout size="14px" />}
                      aria-label="sign out"
                    />
                  </Tooltip>
                </Box>
              </Flex>
            )}
          </Stack>
        </Box>
      ) : null}
      <TransactionsPanel
        transactions={transactions || []}
        mempoolTransactions={mempoolTransactions || []}
        stxAddress={stxAddress}
      />
    </Flex>
  );
}

export default RightPanelBase;

export const RightPanel = dynamic(() => import('./RightPanel'), {
  loading: () => <SkeletonRightPanel />,
});
