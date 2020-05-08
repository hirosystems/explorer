import * as React from 'react';
import { Box, Flex, Stack, Button, ToastProvider } from '@blockstack/ui';
import { Text } from '@components/typography';
import { useDispatch } from 'react-redux';
import { PageWrapper } from '@components/page';
import { TokenTransfer } from '@components/debug/token-transfer';
import { ContractDeploy } from '@components/debug/contract-deploy';
import { ContractCall } from '@components/debug/contract-call';
import { Faucet } from '@components/debug/faucet';

import { ReduxNextPageContext } from '@common/types';

import { useDebugState } from '@common/debug';
import { parseCookies } from 'nookies';

import { fetchAccount, generateIdentity, setIdentity } from '@store/debug';
import { truncateMiddle } from '@common/utils';

const debugPaths = [
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
}) => {
  const isActive = index === currentTab;
  return (
    <Box
      borderBottom={isActive ? '3px solid' : `1px solid`}
      borderBottomColor={isActive ? 'var(--colors-invert)' : 'var(--colors-border)'}
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
      onClick={onClick}
      {...rest}
    >
      <Text fontWeight="medium">{label}</Text>
    </Box>
  );
};

const Tabs = ({ identity }: any) => {
  const [currentTab, setTab] = React.useState(0);
  const handleClick = (index: number) => setTab(index);
  const Component = debugPaths[currentTab].component;
  return (
    <Box>
      <Box width="100%" borderBottom="1px solid" borderBottomColor="var(--colors-border)">
        <Stack isInline spacing="0px">
          {debugPaths.map(({ label, path }, index) => (
            <Tab
              onClick={() => handleClick(index)}
              label={label}
              currentTab={currentTab}
              index={index}
            />
          ))}
        </Stack>
      </Box>
      <Box py="base">
        <Component identity={identity} title={debugPaths[currentTab].label} />
      </Box>
    </Box>
  );
};

const PageContent = ({ userData, handleGenerateKey, ...props }: any) => {
  const { identity, balance } = useDebugState();
  return (
    <PageWrapper
      notice="This is for test use only. Any address generated here can and will be lost very easily."
      {...props}
    >
      <Flex align="flex-end" justifyContent="space-between">
        <Text color="var(--colors-text-title)" as="h1">
          Stacks Explorer Debugger
        </Text>
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
const DebugPage = () => {
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

DebugPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const cookies = parseCookies(ctx);
  if (cookies && cookies.debug_identity) {
    ctx.store.dispatch(setIdentity(JSON.parse(cookies.debug_identity)));
    return {
      identity: cookies.debug_identity,
    };
  }
  return {};
};

export default DebugPage;
