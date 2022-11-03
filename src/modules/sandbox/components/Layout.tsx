import React, { FC, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  color,
  Flex,
  Grid,
  IconButton,
  Stack,
  useClipboard,
  Circle,
} from '@stacks/ui';
import { border, microToStacks, truncateMiddle } from '@common/utils';
import { SideNav } from '@modules/sandbox/components/SideNav';
import { TransactionsPanel } from '@modules/sandbox/components/TransactionsPanel';
import { Caption, Text, Title } from '@components/typography';
import { IconLogout, IconMenu2, IconUser } from '@tabler/icons';
import { Tooltip } from '@components/tooltip';
import { StxInline } from '@components/icons/stx-inline';
import { useUser } from '@modules/sandbox/hooks/useUser';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import {
  selectShowRightPanel,
  setUserData,
  toggleRightPanel,
} from '@modules/sandbox/sandbox-slice';

export const Layout: FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const {
    isConnected,
    userData,
    connect,
    disconnect,
    stxAddress,
    transactions,
    mempoolTransactions,
    balance,
  } = useUser();

  const { onCopy, hasCopied } = useClipboard(stxAddress);
  const showRightPanel = useAppSelector(selectShowRightPanel);

  return (
    <>
      <Head>
        <title>Sandbox - Stacks Explorer by Hiro</title>
      </Head>
      <Flex
        border={border()}
        borderRadius="12px"
        bg={color('bg')}
        flexDirection="column"
        flexGrow={1}
        flexShrink={1}
        mb="extra-loose"
      >
        <Flex alignItems="center" justifyContent="space-between" borderBottom={border()}>
          <Box p="base" color={color('text-title')}>
            Stacks Explorer Sandbox
          </Box>
          <Flex alignItems="center" px="base">
            {!isConnected ? (
              <Button
                onClick={() =>
                  connect({
                    onFinish: authData => {
                      dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                    },
                  })
                }
                size="sm"
              >
                Connect Stacks Wallet
              </Button>
            ) : (
              <Stack spacing="loose" isInline>
                <Stack isInline alignItems="center">
                  <Circle color={color('text-body')} boxShadow="low" size="20px" border={border()}>
                    <IconUser size="14px" />
                  </Circle>
                  <Caption>{userData?.identityAddress}</Caption>
                </Stack>
                <Stack isInline alignItems="center">
                  <IconButton
                    color={color('text-title')}
                    onClick={() => dispatch(toggleRightPanel())}
                    icon={IconMenu2}
                  />
                </Stack>
              </Stack>
            )}
          </Flex>
        </Flex>
        <Grid
          gridTemplateColumns={showRightPanel ? `72px 1fr calc(1142px / 3)` : '72px 1fr'}
          minHeight="calc(100vh - 217px)"
          flexGrow={1}
          flexShrink={1}
        >
          <SideNav />
          {isConnected ? (
            children
          ) : (
            <Flex
              flexGrow={1}
              alignItems="center"
              justifyContent="flex-start"
              pt="120px"
              flexDirection="column"
              maxWidth="300px"
              mx="auto"
            >
              <Stack spacing="extra-loose" textAlign="center">
                <Title fontSize={3}>Welcome to the sandbox</Title>
                <Title>Please sign in to continue</Title>
                <Button
                  onClick={() =>
                    connect({
                      onFinish: authData => {
                        dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                      },
                    })
                  }
                  width="100%"
                >
                  Connect Stacks Wallet
                </Button>
              </Stack>
            </Flex>
          )}
          {showRightPanel && isConnected ? (
            <Flex
              flexGrow={1}
              flexDirection="column"
              maxHeight={'calc(100vh - 217px)'}
              zIndex="100"
              borderLeft={border()}
            >
              {balance ? (
                <Box bg={color('bg')} borderBottom={border()} p="loose">
                  <Stack spacing="base">
                    <Stack textAlign="right">
                      <Caption>Account balance</Caption>
                      <Flex
                        flexShrink={0}
                        flexGrow={1}
                        alignItems="center"
                        position="relative"
                        justifyContent="flex-end"
                        color={color('text-title')}
                      >
                        <StxInline strokeWidth={2} color="currentColor" mr="tight" size="18px" />
                        <Text
                          fontWeight={600}
                          fontSize={4}
                          display="block"
                          position="relative"
                          zIndex={2}
                        >
                          {balance?.stx?.balance ? microToStacks(balance.stx.balance) : 0} STX
                        </Text>
                      </Flex>
                    </Stack>
                    {stxAddress && (
                      <Flex textAlign="right" justifyContent="flex-end" alignItems="center">
                        <Tooltip
                          labelProps={{ fontSize: 0 }}
                          placement="left"
                          label={hasCopied ? 'Copied!' : 'Click to copy'}
                        >
                          <Caption onClick={onCopy} _hover={{ cursor: 'pointer' }}>
                            {truncateMiddle(stxAddress, 12)}
                          </Caption>
                        </Tooltip>
                        <Box
                          _hover={{ cursor: 'pointer' }}
                          onClick={() => {
                            disconnect();
                          }}
                          position="relative"
                          ml="tight"
                        >
                          <Tooltip placement="bottom" label="Sign out">
                            <IconButton
                              size="20px"
                              iconSize="14px"
                              color={color('text-body')}
                              icon={IconLogout}
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
          ) : null}
        </Grid>
      </Flex>
    </>
  );
};
