import * as React from 'react';
import { Box, Flex, Button, BoxProps } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect';
import { useHover } from 'use-events';
import { Popover } from '@components/popover/popover';
import { microToStacks } from '@common/utils';
import { useSandboxState } from '@common/sandbox';
import { Tabs } from '@components/sandbox/tabs';
import { Text, Title } from '@components/typography';
import { PageWrapper } from '@components/page';
import { Card } from '@components/card';
import { Meta } from '@components/meta-head';
import AccountIcom from 'mdi-react/AccountCircleOutlineIcon';

const SignedOutView = ({ onClick }: any) => {
  return (
    <>
      <Meta title="Sandbox" />
      <Flex pb="extra-loose" flexGrow={1} align="center" justify="center">
        <Card mx="auto" p="extra-loose" direction="column" align="center" justify="center">
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

const UserCard = ({
  stxAddress,
  username,
  handleSignOut,
  ...props
}: { stxAddress?: string; username?: string; handleSignOut: () => void } & BoxProps) => {
  const { balance, user, stxAddress: _stxAddress } = useSandboxState();
  const name = username || user?.username;
  const address = stxAddress || _stxAddress;
  const isSignedIn = name && address;

  const ref = React.useRef(null);

  const readableName = name?.includes('.') ? name?.split('.')[0] : name;

  return isSignedIn ? (
    <Box {...props}>
      <Popover
        placement="right"
        items={[{ label: 'Sign Out', value: 'sign-out', key: 0, onClick: handleSignOut }]}
        triggerRef={ref}
        ml="auto"
        width="unset"
        position="relative"
        zIndex={999}
      >
        <Card bg="var(--colors-bg)" boxShadow="mid" px="base-loose" py="base" ref={ref}>
          <Flex align="center">
            <Box textAlign="right">
              <Box>
                <Title fontWeight="600" as="h3" fontSize="16px">
                  {readableName}
                </Title>
              </Box>
              <Box textAlign="right">
                <Text fontSize="16px">{microToStacks(balance as number) || 0} STX</Text>
              </Box>
            </Box>
            <Flex
              align="center"
              justify="center"
              flexShrink={0}
              size="48px"
              borderRadius="100%"
              border="1px solid var(--colors-border)"
              ml="base"
              color="var(--colors-invert)"
            >
              <AccountIcom />
            </Flex>
          </Flex>
        </Card>
      </Popover>
    </Box>
  ) : null;
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
  stxAddress,
  tabs,
  handleSignOut,
  ...props
}: any) => {
  const { doOpenAuth } = useConnect();
  const { user } = useSandboxState();

  const isSignedIn = !!stxAddress || !!user;

  return (
    <PageWrapper
      fullWidth
      notice={{
        label: 'For testing only:',
        message: 'any address generated with the sandbox can and will be lost very easily.',
      }}
      {...props}
    >
      <Flex align="flex-start" justifyContent="space-between">
        <Box>
          <Title as="h1">Stacks Explorer Sandbox</Title>
        </Box>
      </Flex>
      <Flex position="relative" width="100%" py="base" flexGrow={1}>
        {isSignedIn ? (
          <Flex width="100%">
            <Tabs
              hideTransactionDialog={hideTransactionDialog}
              showTransactionDialog={showTransactionDialog}
              transactionsVisible={transactionsVisible}
              tab={tab}
              tabs={tabs}
            />
            <UserCard
              handleSignOut={handleSignOut}
              position="absolute"
              right={0}
              stxAddress={stxAddress}
              username={username}
            />
          </Flex>
        ) : (
          <SignedOutView onClick={() => doOpenAuth()} />
        )}
      </Flex>
    </PageWrapper>
  );
};
