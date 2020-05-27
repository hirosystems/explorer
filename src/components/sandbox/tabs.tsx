import * as React from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Stack, BoxProps } from '@blockstack/ui';
import { Text } from '@components/typography';
import { TransactionsCard } from '@components/sandbox/transactions-card';
import { useDebugState } from '@common/sandbox';
import { IdentityPayload } from '@store/sandbox/types';

export const Tab = ({
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

export const Tabs = ({
  identity,
  transactionsVisible,
  hideTransactionDialog,
  showTransactionDialog,
  tab,
  tabs,
}: {
  identity?: IdentityPayload;
  transactionsVisible: boolean;
  hideTransactionDialog?: any;
  showTransactionDialog?: any;
  tab: any;
  tabs: {
    path: string;
    component: any;
    label: string;
  }[];
}) => {
  const [currentTab, setTab] = React.useState<string>(tab || tabs[0].path);
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
            {tabs.map(({ label, path }, index) => (
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
          {tabs.map((tab, key: number) => {
            const PathComponent = tab.component;
            return (
              <PathComponent
                showTransactionDialog={showTransactionDialog}
                identity={identity}
                isVisible={tab.path === currentTab}
                title={tab.label}
                key={key}
              />
            );
          })}
        </Box>
      </Box>
    </>
  );
};
