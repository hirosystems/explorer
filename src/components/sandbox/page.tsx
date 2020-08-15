import * as React from 'react';
import { Box, Flex, Button, Spinner } from '@stacks/ui';
import { useConnect } from '@pages/sandbox';
import { useHover } from 'use-events';

import { microToStacks } from '@common/utils';
import RefreshIcon from 'mdi-react/RefreshIcon';

import { useUserSession } from '@common/hooks/use-user-session';
import { Tabs } from '@components/sandbox/tabs';
import { Text, Title } from '@components/typography';
import { PageWrapper } from '@components/page';
import { Card } from '@components/card';
import { Meta } from '@components/meta-head';
import { useSandboxState, useSandboxStateValues } from '@common/hooks/use-sandbox-state';
import { color } from '@components/color-modes';
import { TransactionsCard } from '@components/sandbox/transactions-card';

const SignedOutView = ({ onClick }: any) => {
  return (
    <>
      <Meta title="Sandbox" />
      <Flex pb="extra-loose" flexGrow={1} alignItems="center" justify="center">
        <Card mx="auto" p="extra-loose" flexDirection="column" alignItems="center" justify="center">
          <Box maxWidth="600px" textAlign="center">
            <Box mb="base">
              <Title as="h2">Welcome to the Stacks Explorer Sandbox!</Title>
            </Box>
            <Text>
              With the sandbox you'll be able to test out various aspects of the explorer: get STX
              from the faucet, send transactions, create contracts, and call contract functions.
              Please generate an address to use the sandbox.
            </Text>
          </Box>
          <Box mt="base" mx="auto">
            <Button onClick={onClick}>Continue with Blockstack</Button>
          </Box>
        </Card>
      </Flex>
    </>
  );
};

const UserCard = ({ username, identity, balance, ...rest }: any) => {
  const { doFetchAccount } = useSandboxState();
  const [loading, setLoading] = React.useState('idle');
  const isLoading = loading === 'pending';
  const [isHovered, bindHover] = useHover();
  const handleRefresh = () => {
    if (!isLoading) {
      setLoading('pending');
      void doFetchAccount().then(() => {
        setTimeout(() => setLoading('idle'), 350);
      });
    }
  };
  return (
    <Box borderBottom={`1px solid ${color('border')}`} textAlign="right" {...rest}>
      <Box>
        <Flex
          flexShrink={0}
          flexGrow={1}
          justifyContent="flex-end"
          textAlign="right"
          alignItems="center"
          position="relative"
          {...bindHover}
        >
          <Text
            fontWeight={600}
            fontSize="22px"
            transform={isLoading || isHovered ? 'translateX(-24px)' : 'none'}
            transition="all 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
            display="block"
            background={color('bg')}
            position="relative"
            zIndex={2}
          >
            {balance ? microToStacks(balance as number) : 0} <Text opacity={0.5}>STX</Text>
          </Text>
          <Flex
            alignItems="center"
            justify="center"
            position="absolute"
            zIndex={1}
            ml="extra-tight"
            color={color('invert')}
            opacity={isLoading ? 1 : 0.75}
            cursor={!isLoading && isHovered ? 'pointer' : 'unset'}
            transition="all 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
            onClick={handleRefresh}
            _hover={{
              opacity: 1,
            }}
          >
            {isLoading ? (
              <Box transform="translateX(-5px) translateY(2px)">
                <Spinner size="sm" />
              </Box>
            ) : (
              <Box>
                <RefreshIcon />
              </Box>
            )}
          </Flex>
        </Flex>

        <Text as="h3" fontSize="16px">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
          {username?.toString().split('.')[0]}
        </Text>
      </Box>
      {identity && identity.address ? (
        <>
          <Box>
            <Box>
              <Text fontFamily="Fira Code" fontWeight="500" fontSize="12px">
                {identity.address}
              </Text>
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export const PageContent = ({
  userData,
  handleGenerateKey,
  transactionsVisible,
  hideTransactionDialog,
  showTransactionDialog,
  lastViewedNumber,
  tab,
  username,
  tabs,
  ...props
}: any) => {
  const { identity, balance } = useSandboxState();
  const { doOpenAuth } = useConnect();
  const { userData: user } = useUserSession();

  const isSignedIn = (username || user.username) && identity;
  const sidebarWidth = `${isSignedIn ? 420 : 0}px`;
  return (
    <PageWrapper maxWidth="100vw" overflow="hidden" px="0" py="0" {...props}>
      <Flex width="100%" flexGrow={1}>
        <Flex flexDirection="column" maxWidth={`calc(100% - ${sidebarWidth})`} flexGrow={1}>
          <Flex
            pl="extra-loose"
            pt="extra-loose"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box>
              <Title as="h1">Stacks Explorer Sandbox</Title>
            </Box>
          </Flex>
          <Flex maxHeight="calc(100vh - 195px)" width="100%" flexGrow={1}>
            {isSignedIn ? (
              <Tabs
                hideTransactionDialog={hideTransactionDialog}
                showTransactionDialog={showTransactionDialog}
                transactionsVisible={transactionsVisible}
                identity={identity}
                tab={tab}
                tabs={tabs}
              />
            ) : (
              <SignedOutView onClick={() => doOpenAuth()} />
            )}
          </Flex>
        </Flex>
        {isSignedIn && (
          <Box width={sidebarWidth} position="relative">
            <Box
              position="fixed"
              right={0}
              width={sidebarWidth}
              height="calc(100vh - 132px)"
              top="64px"
              bg={color('bg')}
              borderLeft={`1px solid ${color('border')}`}
            >
              <Box>
                <UserCard
                  username={username || user.username}
                  identity={identity}
                  balance={balance}
                  px="extra-loose"
                  pt="base"
                  pb="base"
                />
              </Box>
              <Box borderBottom={`1px solid ${color('border')}`} px="base" py="tight">
                <Text fontSize="14px">Recent transactions</Text>
              </Box>
              <TransactionsCard visible />
            </Box>
          </Box>
        )}
      </Flex>
    </PageWrapper>
  );
};
