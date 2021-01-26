import React from 'react';
import { Box, BoxProps, color, Flex, Grid, Stack } from '@stacks/ui';
import { Text } from '@components/typography';
import { Section } from '@components/section';
import { border } from '@common/utils';
import { TransactionsPanel } from '@sandbox/components/transactions-panel';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tabState, txPanelState } from '@sandbox/store/sandbox';
import { DeployView } from '@sandbox/components/views/deploy/deploy';
import { ContractCallView } from '@sandbox/components/views/contract-call';
import { FaucetView } from '@sandbox/components/views/faucet';
import { TokenTransferView } from '@sandbox/components/views/token-transfer';
import { useUser } from '@sandbox/hooks/use-user';
import { Meta } from '@components/meta-head';

const HeaderItem = React.memo((props: BoxProps) => (
  <Text
    display="block"
    fontSize="14px"
    _hover={{ color: color('text-title') }}
    color={color('text-caption')}
    fontWeight="500"
    cursor="pointer"
    py="base"
    {...props}
  />
));

const TabContent = () => {
  const activeTab = useRecoilValue(tabState);

  switch (activeTab) {
    case 'transfer':
      return <TokenTransferView />;
    case 'faucet':
      return <FaucetView />;
    case 'call':
      return <ContractCallView />;
    default:
      return <DeployView />;
  }
};

const tabs: { label: string; slug: 'deploy' | 'call' | 'transfer' | 'faucet' }[] = [
  { label: 'Deploy contracts', slug: 'deploy' },
  { label: 'Call contracts', slug: 'call' },
  { label: 'Send STX', slug: 'transfer' },
  { label: 'Faucet', slug: 'faucet' },
];

const Tabs = React.memo(() => {
  const [activeTab, setActiveTab] = useRecoilState(tabState);
  return (
    <>
      <Meta title={`${tabs.find(tab => tab.slug === activeTab)?.label || 'Sandbox'}`} />
      <Stack isInline spacing="base">
        {tabs.map(tab => (
          <HeaderItem
            color={activeTab === tab.slug ? color('text-title') : color('text-caption')}
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
          >
            {tab.label}
          </HeaderItem>
        ))}
      </Stack>
    </>
  );
});

const Header: React.FC = React.memo(() => {
  const [txVisibility, setTxVisibility] = useRecoilState(txPanelState);
  const { hasTransactions } = useUser();

  const txHidden = txVisibility === 'hidden';
  const toggleVisibility = React.useCallback(() => {
    if (txHidden) {
      setTxVisibility('visible');
    } else {
      setTxVisibility('hidden');
    }
  }, [txVisibility]);

  return (
    <Flex borderBottom={border()} alignItems="center" justifyContent="space-between" px="base">
      <Tabs />
      {hasTransactions ? (
        <Box>
          <HeaderItem cursor="pointer" onClick={toggleVisibility}>
            {txHidden ? 'Show' : 'Hide'} transactions
          </HeaderItem>
        </Box>
      ) : null}
    </Flex>
  );
});

export const SignedInView: React.FC<BoxProps> = React.memo(props => {
  const [activeTab, setActiveTab] = useRecoilState(tabState);
  const txVisibility = useRecoilValue(txPanelState);
  const { hasTransactions, balances } = useUser();

  React.useEffect(() => {
    if (balances?.stx?.balance === '0' && activeTab !== 'faucet') {
      setActiveTab('faucet');
    }
  }, [balances?.stx?.balance]);

  const txShowing = txVisibility === 'visible' && hasTransactions;
  const width = txShowing ? '480px' : '0px';
  return (
    <Section flexGrow={1}>
      <Header />
      <Flex flexGrow={1}>
        <TabContent />
        {hasTransactions ? <TransactionsPanel /> : null}
      </Flex>
    </Section>
  );
});
