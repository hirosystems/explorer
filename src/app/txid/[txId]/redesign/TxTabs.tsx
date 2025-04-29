import { formatBlockTime, getAmount, getToAddress } from '@/app/transactions/utils';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import {
  MempoolTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

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

function getTabsTriggersByTransactionType(
  tx: Transaction | MempoolTransaction,
  selectedTab: string,
  setSelectedTab: (tab: string) => void
) {
  console.log({ tx, txType: tx.tx_type });
  if (tx.tx_type === 'token_transfer') {
    // TODO: get the # of events and add that to the events label
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

function TabsContentContainer({ children }: { children: React.ReactNode }) {
  return (
    <Stack borderRadius="redesign.xl" border="1px solid" borderColor="borderSecondary" p={3}>
      {children}
    </Stack>
  );
}

function OverviewKeyValueItem({ key, value }: { key: string; value: string }) {
  return (
    <Flex alignItems="center" p={3}>
      <Text minWidth={50} textStyle="text-medium-sm" color="textSecondary">
        {key}
      </Text>
      <Text textStyle="text-regular-sm" color="textPrimary">
        {value}
      </Text>
    </Flex>
  );
}

function TokenTransferOverviewContent(tx: TokenTransferTransaction) {
  return (
    <Stack>
      <OverviewKeyValueItem key="ID" value={tx.tx_id} />
      <OverviewKeyValueItem key="Amount" value={getAmount(tx).toString()} />
      <OverviewKeyValueItem key="From" value={tx.sender_address} />
      <OverviewKeyValueItem key="To" value={getToAddress(tx)} />
      <OverviewKeyValueItem key="Timestamp" value={formatBlockTime(tx.block_time)} />
      <OverviewKeyValueItem key="Fee" value={tx.fee_rate} />
      {/* <OverviewKeyValueItem key="Memo" value={tx.} /> */}
      <OverviewKeyValueItem key="Nonce" value={tx.nonce?.toString() || ''} />
      <OverviewKeyValueItem key="Block height" value={tx.block_height?.toString() || ''} />
      {/* <OverviewKeyValueItem key="Tenure height" value={tx.} /> */}
      <OverviewKeyValueItem key="Bitcoin Anchor" value={tx.burn_block_height?.toString() || ''} />
    </Stack>
  );
}

function getTabsContentByTransactionType(tx: Transaction | MempoolTransaction) {
  if (tx.tx_type === 'token_transfer') {
    return (
      <>
        <TabsContent key="overview" value="overview" w="100%">
          <TabsContentContainer>
            <TokenTransferOverviewContent tx={tx as TokenTransferTransaction} />
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
      p={4}
      borderRadius="redesign.xl"
    >
      <TabsList flexWrap={'wrap'}>
        {getTabsTriggersByTransactionType(tx, selectedTab, setSelectedTab)}
      </TabsList>
      {getTabsContentByTransactionType(tx)}
    </TabsRoot>
  );
};
