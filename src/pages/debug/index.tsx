import * as React from 'react';
import { Text, Box, Flex, Input, FormLabel, Stack, Button } from '@blockstack/ui';
import { PageWrapper } from '@components/page';
import { TokenTransfer } from '@components/debug/token-transfer';
import { ContractDeploy } from '@components/debug/contract-deploy';
import { ContractCall } from '@components/debug/contract-call';

// @ts-ignore
import { Connect, useConnect, ContractCallArgumentType } from '@blockstack/connect';
import { useUserSession } from '@common/hooks/use-user-session';

const debugPaths = [
  { path: 'token-transfer', label: 'Token Transfer', component: TokenTransfer },
  { path: 'contract-deploy', label: 'Contract Deploy', component: ContractDeploy },
  { path: 'contract-call', label: 'Contract Call', component: ContractCall },
];
const authOrigin = 'https://deploy-preview-301--stacks-authenticator.netlify.app';

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

const Tabs = (props: any) => {
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
        <Component />
      </Box>
    </Box>
  );
};
interface UserData {
  loaded: boolean;
}
const PageContent = ({ userData, signedIn, ...props }: any) => {
  const { doOpenAuth, doContractCall } = useConnect();

  const handleContractCall = async () => {
    await doContractCall({
      authOrigin,
      contractAddress: 'STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP',
      functionName: 'set-value',
      functionArgs: [{ value: 'testing', type: ContractCallArgumentType.BUFFER }],
      contractName: 'testing-asdasda',
      finished: (data: any) => {
        console.log('finished!', data);
      },
    });
  };

  return (
    <PageWrapper>
      <Flex align="flex-end" justifyContent="space-between">
        <Text color="var(--colors-text-title)" as="h1">
          Stacks Explorer Debugger
        </Text>
        <Box>
          {signedIn ? (
            // @ts-ignore
            <Text color="var(--colors-text-body)" fontWeight={500}>
              {userData?.username}
            </Text>
          ) : (
            <Button onClick={doOpenAuth}>Sign In</Button>
          )}
        </Box>
      </Flex>
      <Box width="100%" py="base">
        <Tabs />
      </Box>
    </PageWrapper>
  );
};
const DebugPage = (props: any) => {
  // @ts-ignore

  const { userSession, userData, signedIn } = useUserSession();

  const authOptions = {
    authOrigin,
    redirectTo: '/',
    // @ts-ignore
    finished: ({ userSession }) => {
      console.log(userSession.loadUserData());
    },
    appDetails: {
      name: 'Stacks Explorer',
      icon: 'https://example.com/icon.png',
    },
    userSession,
  };

  return (
    <Connect authOptions={authOptions}>
      <PageContent signedIn={signedIn} userData={userData} />
    </Connect>
  );
};

export default DebugPage;
