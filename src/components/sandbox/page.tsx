import * as React from 'react';
import { Box, Flex, Spinner, Grid, GridProps, BoxProps, Stack } from '@stacks/ui';
import { useConnect } from '@pages/sandbox';
import { useHover } from 'use-events';

import { Button } from '@components/button';

import { microToStacks } from '@common/utils';
import RefreshIcon from 'mdi-react/RefreshIcon';

import { useUserSession } from '@common/hooks/use-user-session';
import { Tabs } from '@components/sandbox/tabs';
import { Caption, Text, Title } from '@components/typography';

import { Meta } from '@components/meta-head';
import { useSandboxState } from '@common/hooks/use-sandbox-state';
import { color } from '@components/color-modes';
import { TransactionsCard } from '@components/sandbox/transactions-card';
import { CodeIcon } from '@components/icons/code';
import { StxInline } from '@components/icons/stx-inline';
import DropIcon from 'mdi-react/DropIcon';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { Section } from '@components/section';

const Item = ({ children, ...props }: GridProps) => (
  <Grid textAlign="center" placeItems="center" {...props}>
    <Stack spacing="base-tight" alignItems="center" justifyContent="center">
      {children}
    </Stack>
  </Grid>
);
const IconWrapper = (props: GridProps) => (
  <Grid color="white" bg="#9985FF" size="36px" borderRadius="100%" placeItems="center" {...props} />
);
const ItemLabel = (props: BoxProps) => <Text fontWeight="500" {...props} />;
const SignedOutView = ({ onClick }: any) => {
  return (
    <>
      <Meta title="Sandbox" />
      <Section px="base" py="extra-loose">
        <Title width="100%" textAlign="center" as="h2" mt="0">
          Welcome to the Stacks Explorer Sandbox!
        </Title>
        <Grid
          maxWidth="70%"
          mx="auto"
          my="extra-loose"
          columnGap="base"
          width="100%"
          gridTemplateColumns="repeat(4, 1fr)"
        >
          <Item>
            <IconWrapper>
              <DropIcon />
            </IconWrapper>
            <ItemLabel>Faucet</ItemLabel>
            <Caption textAlign="center" maxWidth="18ch">
              Get testnet STX to play around with.
            </Caption>
          </Item>
          <Item>
            <IconWrapper>
              <StxInline strokeWidth={2} color="currentColor" size="18px" />
            </IconWrapper>
            <ItemLabel>Send STX</ItemLabel>
            <Caption textAlign="center" maxWidth="18ch">
              Send and receive STX with others.
            </Caption>
          </Item>
          <Item>
            <IconWrapper>
              <CodeIcon strokeWidth={2} size="22px" />
            </IconWrapper>
            <ItemLabel>Deploy contracts</ItemLabel>
            <Caption textAlign="center" maxWidth="18ch">
              Test and deploy your Clarity smart contracts.
            </Caption>
          </Item>
          <Item>
            <IconWrapper>
              <FunctionIcon size="24px" />
            </IconWrapper>
            <ItemLabel>Call contracts</ItemLabel>
            <Caption textAlign="center" maxWidth="18ch">
              Call contracts and test out Stacking (PoX).
            </Caption>
          </Item>
        </Grid>
        <Box mt="base" mx="auto">
          <Button onClick={onClick}>Continue with Blockstack</Button>
        </Box>
      </Section>
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
    <>
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
    </>
  );
};
