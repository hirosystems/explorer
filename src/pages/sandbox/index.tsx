import * as React from 'react';
import { Box, Flex, Stack, Button, ToastProvider, BoxProps } from '@blockstack/ui';
import { Text, Title } from '@components/typography';
import { useDispatch } from 'react-redux';
import { PageWrapper } from '@components/page';
import { TokenTransfer } from '@components/sandbox/token-transfer';
import { ContractDeploy } from '@components/sandbox/contract-deploy';
import { ContractCall } from '@components/sandbox/contract-call';
import { Faucet } from '@components/sandbox/faucet';
import { RawTx } from '@components/sandbox/raw-tx';
import { TransactionsCard } from '@components/sandbox/transactions-card';
import { ReduxNextPageContext } from '@common/types';
import { useDebugState } from '@common/sandbox';
import { parseCookies } from 'nookies';
import { fetchAccount, generateIdentity, setIdentity, setUserData } from '@store/sandbox';
import { truncateMiddle, usernameStorage, USERNAME_COOKIE } from '@common/utils';
import { useRouter } from 'next/router';
import { useHover } from 'use-events';
import { Card } from '@components/card';
import { Connect, FinishedData, useConnect } from '@blockstack/connect';
import { useUserSession } from '@common/hooks/use-user-session';

const paths = [
  { path: 'faucet', label: 'STX faucet', component: Faucet },
  { path: 'stx-transfer', label: 'STX transfer', component: TokenTransfer },
  { path: 'raw-tx', label: 'Raw transaction', component: RawTx },
  { path: 'contract-deploy', label: 'Contract deploy', component: ContractDeploy },
  { path: 'contract-call', label: 'Contract call', component: ContractCall },
];

const Tab = ({
  currentTab,
  index,
  label,
  onClick,
  isActive,
  ...rest
}: {
  currentTab?: string;
  index?: number;
  label: string;
  onClick?: any;
  isActive: boolean;
} & BoxProps) => {
  return (
    <Box
      borderBottom={isActive ? '2px solid' : `1px solid`}
      borderBottomColor={isActive ? 'var(--colors-accent)' : 'var(--colors-border)'}
      px="base"
      py="base-tight"
      color={isActive ? 'var(--colors-invert)' : 'var(--colors-text-caption)'}
      transform="translateY(1px)"
      _hover={{
        color: isActive ? 'var(--colors-invert)' : 'var(--colors-invert)',
        borderBottomColor: isActive ? 'var(--colors-invert)' : 'var(--colors-text-caption)',
        cursor: isActive ? 'unset' : 'pointer',
      }}
      style={{
        userSelect: 'none',
      }}
      transition="all 0.2s ease-in-out"
      onClick={onClick}
      {...rest}
    >
      <Text color="currentColor">{label}</Text>
    </Box>
  );
};

const Tabs = ({
  identity,
  transactionsVisible,
  hideTransactionDialog,
  showTransactionDialog,
  tab,
}: any) => {
  const [currentTab, setTab] = React.useState<string>(tab || paths[0].path);
  const router = useRouter();

  const handleClick = React.useCallback((path: string) => {
    router.push(`/sandbox?tab=${path}`, `/sandbox?tab=${path}`, { shallow: true });
    setTab(path);
  }, []);
  const { transactions } = useDebugState();
  return (
    <>
      <Box width="100%" position="relative" zIndex={99}>
        <Flex width="100%" borderBottom="1px solid" borderBottomColor="var(--colors-border)">
          <Stack isInline spacing="0px">
            {paths.map(({ label, path }, index) => (
              <Tab
                onClick={() => handleClick(path)}
                label={label}
                currentTab={currentTab}
                index={index}
                key={index}
                isActive={currentTab === path}
              />
            ))}
          </Stack>
          <Box transform="translateY(1px)" ml="auto" position="relative" zIndex={99}>
            <Tab
              label={`(${transactions?.length ?? 0}) Recent Txs`}
              index={1}
              onClick={() => showTransactionDialog()}
              isActive={transactionsVisible}
            />
            <TransactionsCard
              visible={transactionsVisible}
              hide={hideTransactionDialog}
              bg="var(--colors-bg)"
              position="absolute"
              top="calc(100% - 37px)"
              right="0"
              minWidth="544px"
            />
          </Box>
        </Flex>
        <Box py="base">
          {paths.map((path, key) => {
            const PathComponent = path.component;
            return (
              <PathComponent
                showTransactionDialog={showTransactionDialog}
                identity={identity}
                isVisible={path.path === currentTab}
                title={path.label}
                key={key}
              />
            );
          })}
        </Box>
      </Box>
    </>
  );
};

const PageContent = ({
  userData,
  handleGenerateKey,
  transactionsVisible,
  hideTransactionDialog,
  showTransactionDialog,
  lastViewedNumber,
  tab,
  username,
  ...props
}: any) => {
  const { identity, balance } = useDebugState();
  const [isHovered, bindHover] = useHover();
  const { doOpenAuth } = useConnect();
  const { userData: user } = useUserSession();
  return (
    <PageWrapper
      notice={{
        label: 'For testing only:',
        message: 'any address generated with the sandbox can and will be lost very easily.',
      }}
      {...props}
    >
      <Flex align="flex-start" justifyContent="space-between">
        <Title as="h1">Stacks Explorer Sandbox</Title>
        <Box>
          {(username && identity) || (identity && user?.profile) ? (
            <Box textAlign="right">
              <Box>
                <Text as="h3" fontSize="16px">
                  {user.username}
                </Text>
              </Box>
              <Box {...bindHover}>
                <Text fontSize="14px">
                  {isHovered ? identity.address : truncateMiddle(identity.address, 6)}
                </Text>
                <Text> </Text>
                <Text fontSize="14px">{balance || 0} uSTX</Text>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Flex>
      <Flex width="100%" py="base" flexGrow={1}>
        {(username && identity) || (identity && user?.profile) ? (
          <Tabs
            hideTransactionDialog={hideTransactionDialog}
            showTransactionDialog={showTransactionDialog}
            transactionsVisible={transactionsVisible}
            identity={identity}
            lastViewedNumber={lastViewedNumber}
            tab={tab}
          />
        ) : (
          <Flex pb="extra-loose" flexGrow={1} align="center" justify="center">
            <Card mx="auto" p="extra-loose" direction="column" align="center" justify="center">
              <Box maxWidth="600px" textAlign="center">
                <Box mb="base">
                  <Title as="h2">Welcome to the Stacks Explorer Sandbox!</Title>
                </Box>
                <Text>
                  With the sandbox you'll be able to test out various aspects of the explorer: get
                  STX from the faucet, send transactions, create contracts, and call contract
                  functions. Please generate an address to use the sandbox.
                </Text>
              </Box>
              <Box mt="base" mx="auto">
                <Button
                  onClick={() => {
                    doOpenAuth();
                  }}
                >
                  Continue with Blockstack
                </Button>
              </Box>
            </Card>
          </Flex>
        )}
      </Flex>
    </PageWrapper>
  );
};
const SandboxPage = ({ tab, username }: any) => {
  const [transactionsVisible, setShowTransactions] = React.useState(false);
  const [lastViewedNumber, setLastViewed] = React.useState(0);

  const hideTransactionDialog = () => {
    setShowTransactions(false);
  };
  const showTransactionDialog = () => {
    setShowTransactions(true);
  };

  const dispatch = useDispatch();

  const { lastFetch, loading, identity, error } = useDebugState();

  if (!error && !lastFetch && loading !== 'pending' && identity) {
    dispatch(fetchAccount(identity.address));
  }

  const handleGenerateId = async () => {
    await dispatch(generateIdentity());
  };

  const iconPrefix =
    typeof document !== 'undefined'
      ? document.location.href.toString().replace('/sandbox', '')
      : '';

  const authOptions = {
    finished: async (payload: FinishedData) => {
      const userData = payload.userSession.loadUserData();
      await dispatch(setUserData(userData));
      usernameStorage.set(USERNAME_COOKIE, userData.username);
      await handleGenerateId();
    },

    appDetails: {
      name: 'Stacks Explorer',
      icon: iconPrefix + '/app-icon.png',
    },
  };

  return (
    <Connect authOptions={authOptions}>
      <ToastProvider>
        <PageContent
          hideTransactionDialog={hideTransactionDialog}
          showTransactionDialog={showTransactionDialog}
          transactionsVisible={transactionsVisible}
          handleGenerateKey={handleGenerateId}
          lastViewedNumber={lastViewedNumber}
          username={username}
          tab={tab}
        />
      </ToastProvider>
    </Connect>
  );
};

SandboxPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const cookies = parseCookies(ctx);
  let tab = ctx?.query?.tab ?? undefined;
  if (cookies) {
    cookies.debug_identity && ctx.store.dispatch(setIdentity(JSON.parse(cookies.debug_identity)));
    return {
      identity: cookies.debug_identity,
      username: cookies[USERNAME_COOKIE] ? JSON.parse(cookies[USERNAME_COOKIE]) : undefined,
      tab,
    };
  }
  return { tab };
};

export default SandboxPage;
