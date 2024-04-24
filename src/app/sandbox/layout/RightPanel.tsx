import React from 'react';
import { MdOutlineLogout } from 'react-icons/md';

import { Card } from '../../../common/components/Card';
import { useAppSelector } from '../../../common/state/hooks';
import { microToStacksFormatted, truncateMiddle } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { Stack } from '../../../ui/Stack';
import { Tooltip } from '../../../ui/Tooltip';
import { StxIcon } from '../../../ui/icons';
import { Caption, Text } from '../../../ui/typography';
import { TransactionsPanel } from '../components/TransactionsPanel';
import { useUser } from '../hooks/useUser';
import { selectShowRightPanel } from '../sandbox-slice';

export function RightPanel() {
  const { isConnected, disconnect, stxAddress, txs, mempoolTransactions, balance } = useUser();
  const showRightPanel = useAppSelector(selectShowRightPanel);
  if (!showRightPanel || !isConnected) return null;

  return (
    <Card
      rounded={'none'}
      flexGrow={1}
      flexDirection="column"
      borderLeftWidth={'1px'}
      position={'absolute'}
      right={0}
      top={0}
      width={96}
      height={'full'}
    >
      {balance ? (
        <Box bg={'surface'} borderBottomWidth="1px" p={7}>
          <Stack gap={4}>
            <Stack textAlign="right">
              <Caption>Account balance</Caption>
              <Flex
                flexShrink={0}
                flexGrow={1}
                alignItems="center"
                position="relative"
                justifyContent="flex-end"
                color={'textTitle'}
                gap={'8px'}
              >
                <Icon as={StxIcon} size={'18px'} color="black" />
                <Text fontWeight={600} fontSize={'24px'} display="block" position="relative">
                  {balance?.stx?.balance ? microToStacksFormatted(balance.stx.balance) : 0} STX
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
                      icon={<MdOutlineLogout size={'14px'} />}
                      aria-label={'sign out'}
                    />
                  </Tooltip>
                </Box>
              </Flex>
            )}
          </Stack>
        </Box>
      ) : null}
      <TransactionsPanel />
    </Card>
  );
}
