import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useState } from 'react';

import {
  MempoolTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { TokenTransferTxSummary } from './TxSummary';

function TabTriggerComponent({
  label,
  value,
  isActive,
  onClick,
}: {
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <TabsTrigger
      key={value}
      value={value}
      flex="1"
      w="100%"
      maxW="100%"
      gap={2}
      flexDir={'column'}
      className="group"
      background={isActive ? 'surfacePrimary' : 'none'}
      py={1}
      px={3}
      onClick={onClick}
    >
      <Text
        font="matterRegular"
        textStyle="text-regular-xl"
        color={isActive ? 'textPrimary' : 'textTertiary'}
      >
        {label}
      </Text>
    </TabsTrigger>
  );
}

function TabsContentContainer({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      borderRadius="redesign.xl"
      border="1px solid"
      borderColor="redesignBorderSecondary"
      p={3}
    >
      {children}
    </Stack>
  );
}

function getTabsTriggersByTransactionType(
  tx: Transaction | MempoolTransaction,
  selectedTab: string,
  setSelectedTab: (tab: string) => void
) {
  if (tx.tx_type === 'token_transfer') {
    return (
      <>
        <TabTriggerComponent
          key="overview"
          label="Overview"
          value="overview"
          isActive={selectedTab === 'overview'}
          onClick={() => setSelectedTab('overview')}
        />
        <TabTriggerComponent
          key="events"
          label="Events"
          value="events"
          isActive={selectedTab === 'events'}
          onClick={() => setSelectedTab('events')}
        />
      </>
    );
  }
  if (tx.tx_type === 'contract_call') {
    return null;
  }
  if (tx.tx_type === 'coinbase') {
    return null;
  }
  if (tx.tx_type === 'tenure_change') {
    return null;
  }
  if (tx.tx_type === 'smart_contract') {
    return null;
  }
  return null;
}

function getTabsContentByTransactionType(tx: Transaction | MempoolTransaction) {
  if (tx.tx_type === 'token_transfer') {
    return (
      <>
        <TabsContent key="overview" value="overview" w="100%">
          <TabsContentContainer>
            <TokenTransferTxSummary tx={tx as TokenTransferTransaction} />
          </TabsContentContainer>
        </TabsContent>
        <TabsContent key="events" value="events" w="100%">
          <TabsContentContainer>Events</TabsContentContainer>
        </TabsContent>
      </>
    );
  }
  if (tx.tx_type === 'contract_call') {
    return null;
  }
  if (tx.tx_type === 'coinbase') {
    return null;
  }
  if (tx.tx_type === 'tenure_change') {
    return null;
  }
  if (tx.tx_type === 'smart_contract') {
    return null;
  }
  return null;
}

export const TxTabs = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <TabsRoot
      variant="primary"
      size="redesignMd"
      defaultValue={'overview'}
      //   onValueChange={e => setSelectedChart(e.value as Chart)}
      gap={2}
      borderRadius="redesign.xl"
    >
      <TabsList flexWrap={'wrap'}>
        {getTabsTriggersByTransactionType(tx, selectedTab, setSelectedTab)}
      </TabsList>
      {getTabsContentByTransactionType(tx)}
    </TabsRoot>
  );
};
