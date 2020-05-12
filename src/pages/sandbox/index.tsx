import * as React from 'react';
import { Box, Flex, Stack, Button, ToastProvider, BoxProps } from '@blockstack/ui';
import { Text, Title } from '@components/typography';
import { useDispatch } from 'react-redux';
import { PageWrapper } from '@components/page';
import { TokenTransfer } from '@components/sandbox/token-transfer';
import { ContractDeploy } from '@components/sandbox/contract-deploy';
import { ContractCall } from '@components/sandbox/contract-call';
import { Faucet } from '@components/sandbox/faucet';

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

const Tabs = ({ identity }: any) => {
  const [currentTab, setTab] = React.useState(0);
  const handleClick = (index: number) => setTab(index);
  const Component = paths[currentTab].component;
  return (
    <Box>
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
        <Tab
          ml="auto"
          label="Recent Txs"
          currentTab={0}
          index={1}
          onClick={() => console.log('show')}
        />
      </Flex>
      <Box py="base">
        <Component identity={identity} title={paths[currentTab].label} />
      </Box>
    </Box>
  );
};

const PageContent = ({ userData, handleGenerateKey, ...props }: any) => {
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
        <Tabs identity={identity} />
      </Box>
    </PageWrapper>
  );
};
const SandboxPage = () => {
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
      <PageContent handleGenerateKey={handleGenerateId} />
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
