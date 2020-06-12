import * as React from 'react';
import { Box, Flex, Button } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect';
import { useHover } from 'use-events';

import { truncateMiddle, microToStacks } from '@common/utils';
import { useUserSession } from '@common/hooks/use-user-session';
import { Tabs } from '@components/sandbox/tabs';
import { Text, Title } from '@components/typography';
import { PageWrapper } from '@components/page';
import { Card } from '@components/card';
import { Meta } from '@components/meta-head';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

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

const UserCard = ({ username, identity, balance }: any) => {
  const [isHovered, bindHover] = useHover();
  return (
    <Box textAlign="right">
      <Box>
        <Text as="h3" fontSize="16px">
          {username}
        </Text>
      </Box>
      {identity && identity.address ? (
        <Box {...bindHover}>
          <Text fontSize="14px">
            {isHovered ? identity.address : truncateMiddle(identity.address, 6)}
          </Text>
          <Text> </Text>
          <Text fontSize="14px">{microToStacks(balance as number) || 0} STX</Text>
        </Box>
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
  return (
    <PageWrapper
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
        {isSignedIn ? (
          <Box>
            <UserCard username={username || user.username} identity={identity} balance={balance} />
          </Box>
        ) : null}
      </Flex>
      <Flex width="100%" py="base" flexGrow={1}>
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
    </PageWrapper>
  );
};
