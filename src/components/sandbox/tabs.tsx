import * as React from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Stack, BoxProps } from '@stacks/ui';
import { Text } from '@components/typography';
import { TransactionsCard } from '@components/sandbox/transactions-card';
import { IdentityPayload } from '@store/sandbox/types';
import { useClearErrors } from '@common/hooks/use-clear-errors';
import { useSandboxState } from '@common/hooks/use-sandbox-state';
import { Section } from '@components/section';

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
  isActive?: boolean;
} & BoxProps) => {
  return (
    <Box
      borderBottom={isActive ? '2px solid' : `1px solid`}
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
      transition="all 0.2s ease-in-out"
      onClick={onClick}
      {...rest}
    >
      <Text color="currentColor">{label}</Text>
    </Box>
  );
};

export const Tabs = React.memo(
  ({
    identity,
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
    const clearErrors = useClearErrors();

    const handleClick = React.useCallback((path: string) => {
      void router.push(`/sandbox?tab=${path}`, `/sandbox?tab=${path}`, { shallow: true });
      setTab(path);
      clearErrors();
    }, []);

    return (
      <Section>
        <Flex width="100%" borderBottom="1px solid" borderBottomColor="var(--colors-border)">
          <Stack pl="18px" isInline spacing="0px">
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
        </Flex>
      </Section>
    );

    return (
      <>
        <Flex
          overflow="hidden"
          width="100%"
          position="relative"
          zIndex={99}
          maxHeight="100%"
          flexDirection="column"
        >
          <Flex width="100%" borderBottom="1px solid" borderBottomColor="var(--colors-border)">
            <Stack pl="18px" isInline spacing="0px">
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
          </Flex>
          <Flex position="relative" maxHeight="calc(100% - 51px)" flexGrow={1}>
            {tabs.map((tab, key: number) => {
              const PathComponent = tab.component;
              return PathComponent ? (
                <PathComponent
                  showTransactionDialog={showTransactionDialog}
                  identity={identity}
                  isVisible={tab.path === currentTab}
                  title={tab.label}
                  key={key}
                />
              ) : null;
            })}
          </Flex>
        </Flex>
      </>
    );
  }
);
