import { ScrollIndicator } from '@/common/components/ScrollIndicator';
import { ValueBasisFilterPopover } from '@/common/components/table/filters/value-basis-filter/ValueBasisFiterPopover';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Flex, Stack, StackProps } from '@chakra-ui/react';
import { useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { Events } from './Events';
import { TxSummary } from './TxSummary';
import { FunctionCalled } from './function-called/FunctionCalled';

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
      className={`group`}
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

export function TabsContentContainer({
  children,
  ...stackProps
}: { children: React.ReactNode } & StackProps) {
  return (
    <Stack
      borderRadius="redesign.xl"
      border="1px solid"
      borderColor="redesignBorderSecondary"
      p={3}
      {...stackProps}
    >
      {children}
    </Stack>
  );
}

enum TransactionIdPageTab {
  Overview = 'overview',
  Events = 'events',
  FunctionCall = 'functionCall',
  PostConditions = 'postConditions',
  SourceCode = 'sourceCode',
}

function getTabsTriggersByTransactionType(
  tx: Transaction | MempoolTransaction,
  selectedTab: string,
  setSelectedTab: (tab: string) => void
) {
  const numTxEvents = 'event_count' in tx ? tx.event_count : 0;
  if (tx.tx_type === 'token_transfer') {
    return (
      <>
        <TabTriggerComponent
          key={TransactionIdPageTab.Overview}
          label="Overview"
          value={TransactionIdPageTab.Overview}
          isActive={selectedTab === TransactionIdPageTab.Overview}
          onClick={() => setSelectedTab(TransactionIdPageTab.Overview)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.Events}
          label={`Events ${numTxEvents > 0 ? `(${numTxEvents})` : ''}`}
          value={TransactionIdPageTab.Events}
          isActive={selectedTab === TransactionIdPageTab.Events}
          onClick={() => setSelectedTab(TransactionIdPageTab.Events)}
        />
      </>
    );
  }
  if (tx.tx_type === 'contract_call') {
    return (
      <>
        <TabTriggerComponent
          key={TransactionIdPageTab.Overview}
          label="Overview"
          value={TransactionIdPageTab.Overview}
          isActive={selectedTab === TransactionIdPageTab.Overview}
          onClick={() => setSelectedTab(TransactionIdPageTab.Overview)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.FunctionCall}
          label={'Function call'}
          value={TransactionIdPageTab.FunctionCall}
          isActive={selectedTab === TransactionIdPageTab.FunctionCall}
          onClick={() => setSelectedTab(TransactionIdPageTab.FunctionCall)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.PostConditions}
          label={`Post-conditions ${numTxEvents > 0 ? `(${numTxEvents})` : ''}`} // TODO: add count
          value={TransactionIdPageTab.PostConditions}
          isActive={selectedTab === TransactionIdPageTab.PostConditions}
          onClick={() => setSelectedTab(TransactionIdPageTab.PostConditions)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.Events}
          label={`Events ${numTxEvents > 0 ? `(${numTxEvents})` : ''}`}
          value={TransactionIdPageTab.Events}
          isActive={selectedTab === TransactionIdPageTab.Events}
          onClick={() => setSelectedTab(TransactionIdPageTab.Events)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.SourceCode}
          label={'Source code'}
          value={TransactionIdPageTab.SourceCode}
          isActive={selectedTab === TransactionIdPageTab.SourceCode}
          onClick={() => setSelectedTab(TransactionIdPageTab.SourceCode)}
        />
      </>
    );
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
            <TxSummary tx={tx} />
          </TabsContentContainer>
        </TabsContent>
        <TabsContent key="events" value="events" w="100%">
          <TabsContentContainer>
            <Events tx={tx} />
          </TabsContentContainer>
        </TabsContent>
      </>
    );
  }
  if (tx.tx_type === 'contract_call') {
    return (
      <>
        <TabsContent key="overview" value="overview" w="100%">
          <TabsContentContainer>
            <TxSummary tx={tx} />
          </TabsContentContainer>
        </TabsContent>
        <TabsContent key="functionCall" value="functionCall" w="100%">
          <FunctionCalled tx={tx} />
        </TabsContent>
        <TabsContent key="postConditions" value="postConditions" w="100%">
          <TabsContentContainer>
            <Text>Post-conditions</Text> {/* TODO: add post-conditions */}
          </TabsContentContainer>
        </TabsContent>
        <TabsContent key="events" value="events" w="100%">
          <TabsContentContainer>
            <Events tx={tx} />
          </TabsContentContainer>
        </TabsContent>
        <TabsContent key="sourceCode" value="sourceCode" w="100%">
          <TabsContentContainer>
            <Text>Source code</Text> {/* TODO: add source code */}
          </TabsContentContainer>
        </TabsContent>
      </>
    );
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
      gap={2}
      borderRadius="redesign.xl"
      w="full"
    >
      <Flex justifyContent={'space-between'} w="full" gap={2}>
        <ScrollIndicator>
          <TabsList>{getTabsTriggersByTransactionType(tx, selectedTab, setSelectedTab)}</TabsList>
        </ScrollIndicator>
        <Flex alignItems={'center'} gap={4}>
          <Text textStyle="text-regular-sm">Show:</Text>
          <ValueBasisFilterPopover />
        </Flex>
      </Flex>
      {getTabsContentByTransactionType(tx)}
    </TabsRoot>
  );
};
