import * as React from 'react';
import { Box, Flex, Stack, Button, ToastProvider, BoxProps } from '@blockstack/ui';
import { Text, Title } from '@components/typography';
import { useDispatch } from 'react-redux';
import { PageWrapper } from '@components/page';
import { TokenTransfer } from '@components/sandbox/token-transfer';
import { ContractDeploy } from '@components/sandbox/contract-deploy';
import { ContractCall } from '@components/sandbox/contract-call';
import { Faucet } from '@components/sandbox/faucet';
import { TransactionsCard } from '@components/sandbox/transactions-card';
import { ReduxNextPageContext } from '@common/types';
import { useDebugState } from '@common/sandbox';
import { parseCookies } from 'nookies';

import { fetchAccount, generateIdentity, setIdentity } from '@store/sandbox';
import { truncateMiddle } from '@common/utils';

const paths = [
  { path: 'faucet', label: 'STX Faucet', component: Faucet },
  { path: 'token-transfer', label: 'Token Transfer', component: TokenTransfer },
  { path: 'contract-deploy', label: 'Contract Deploy', component: ContractDeploy },
  { path: 'contract-call', label: 'Contract Call', component: ContractCall },
];

const Tab = ({
  currentTab,
  index,
  label,
  onClick,
  ...rest
}: {
  currentTab: number;
  index: number;
  label: string;
  onClick: any;
} & BoxProps) => {
  const isActive = index === currentTab;
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
}: any) => {
  const [currentTab, setTab] = React.useState(0);
  const handleClick = (index: number) => setTab(index);
  const Component = paths[currentTab].component;
  const { transactions } = useDebugState();
  return (
    <>
      <Box position="relative" zIndex={99}>
        <Flex width="100%" borderBottom="1px solid" borderBottomColor="var(--colors-border)">
          <Stack isInline spacing="0px">
            {paths.map(({ label, path }, index) => (
              <Tab
                onClick={() => handleClick(index)}
                label={label}
                currentTab={currentTab}
                index={index}
                key={index}
              />
            ))}
          </Stack>
          <Box transform="translateY(1px)" ml="auto" position="relative" zIndex={99}>
            <Tab
              label={`(${transactions?.length ?? 0}) Recent Txs`}
              currentTab={0}
              index={1}
              onClick={() => showTransactionDialog()}
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
          <Component
            showTransactionDialog={showTransactionDialog}
            identity={identity}
            title={paths[currentTab].label}
          />
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
        />
      </Box>
    </PageWrapper>
  );
};
const SandboxPage = () => {
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
      />
    </ToastProvider>
  );
};

SandboxPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const cookies = parseCookies(ctx);
  if (cookies && cookies.debug_identity) {
    ctx.store.dispatch(setIdentity(JSON.parse(cookies.debug_identity)));
    return {
      identity: cookies.debug_identity,
    };
  }
  return {};
};

export default SandboxPage;
