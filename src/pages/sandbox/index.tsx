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
import { fetchAccount, generateIdentity, setIdentity } from '@store/sandbox';
import { truncateMiddle } from '@common/utils';
import { useRouter } from 'next/router';

const paths = [
  { path: 'faucet', label: 'STX faucet', component: Faucet },
  { path: 'basic-transaction', label: 'Basic transaction', component: TokenTransfer },
  { path: 'contract-deploy', label: 'Contract deploy', component: ContractDeploy },
  { path: 'contract-call', label: 'Contract call', component: ContractCall },
  // { path: 'raw-tx', label: 'Broadcast raw tx', component: RawTx },
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
      <Box position="relative" zIndex={99}>
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
  ...props
}: any) => {
  const { identity, balance } = useDebugState();
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
          {identity ? (
            <Box textAlign="right">
              <Box>
                <Text>{truncateMiddle(identity.address, 10)}</Text>
              </Box>
              <Box>
                <Text>{balance || 0} uSTX</Text>
              </Box>
            </Box>
          ) : (
            <Button onClick={handleGenerateKey}>Generate address</Button>
          )}
        </Box>
      </Flex>
      <Box width="100%" py="base">
        <Tabs
          hideTransactionDialog={hideTransactionDialog}
          showTransactionDialog={showTransactionDialog}
          transactionsVisible={transactionsVisible}
          identity={identity}
          lastViewedNumber={lastViewedNumber}
          tab={tab}
        />
      </Box>
    </PageWrapper>
  );
};
const SandboxPage = ({ tab }: any) => {
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

  return (
    <ToastProvider>
      <PageContent
        hideTransactionDialog={hideTransactionDialog}
        showTransactionDialog={showTransactionDialog}
        transactionsVisible={transactionsVisible}
        handleGenerateKey={handleGenerateId}
        lastViewedNumber={lastViewedNumber}
        tab={tab}
      />
    </ToastProvider>
  );
};

SandboxPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const cookies = parseCookies(ctx);
  let tab = ctx?.query?.tab ?? undefined;
  if (cookies && cookies.debug_identity) {
    ctx.store.dispatch(setIdentity(JSON.parse(cookies.debug_identity)));
    return {
      identity: cookies.debug_identity,
      tab,
    };
  }
  return { tab };
};

export default SandboxPage;
