import { ScrollIndicator } from '@/common/components/ScrollIndicator';
import { ValueBasisFilterPopover } from '@/common/components/table/filters/value-basis-filter/ValueBasisFiterPopover';
import { DEFAULT_LIST_LIMIT } from '@/common/constants/constants';
import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { useAddressConfirmedTxsWithTransfers } from '@/common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Flex, Grid, Stack, StackProps } from '@chakra-ui/react';
import { useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { DetailsCard } from './DetailsCard';
import { Events } from './Events';
import { AvailableFunctions } from './function-called/AvailableFunctions';
import { FunctionCalled } from './function-called/FunctionCalled';
import { PostConditions } from './post-conditions/PostConditions';
import { Source } from './source/Source';
import { Transactions } from './transactions/Transactions';
import { TxSummary } from './tx-summary/TxSummary';

function TabTriggerComponent({
  label,
  value,
  secondaryLabel,
  isActive,
  onClick,
}: {
  label: string;
  value: string;
  secondaryLabel?: string;
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
      flexDirection={'column'}
      className={`group`}
      background={isActive ? 'surfacePrimary' : 'none'}
      py={1}
      px={3}
      onClick={onClick}
    >
      <Flex gap={1} alignItems="center">
        <Text textStyle="heading-xs" color={isActive ? 'textPrimary' : 'textSecondary'}>
          {label}
        </Text>
        {secondaryLabel && (
          <Text textStyle="heading-xs" color={isActive ? 'textPrimary' : 'textTertiary'}>
            {secondaryLabel}
          </Text>
        )}
      </Flex>
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
  AvailableFunctions = 'availableFunctions',
  Transactions = 'transactions',
}

function TabsTriggersByTransactionType({
  tx,
  selectedTab,
  setSelectedTab,
  txCount,
}: {
  tx: Transaction | MempoolTransaction;
  selectedTab: TransactionIdPageTab;
  setSelectedTab: (tab: TransactionIdPageTab) => void;
  txCount: number;
}) {
  const numTxEvents = 'event_count' in tx ? tx.event_count : 0;
  const numPostConditions = 'post_conditions' in tx ? tx.post_conditions.length : 0;

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
          label={`Events`}
          secondaryLabel={numTxEvents > 0 ? `(${numTxEvents})` : ''}
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
          label={'Function called'}
          value={TransactionIdPageTab.FunctionCall}
          isActive={selectedTab === TransactionIdPageTab.FunctionCall}
          onClick={() => setSelectedTab(TransactionIdPageTab.FunctionCall)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.PostConditions}
          label={`Post-conditions`}
          secondaryLabel={numPostConditions > 0 ? `(${numPostConditions})` : ''}
          value={TransactionIdPageTab.PostConditions}
          isActive={selectedTab === TransactionIdPageTab.PostConditions}
          onClick={() => setSelectedTab(TransactionIdPageTab.PostConditions)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.Events}
          label={`Events`}
          secondaryLabel={numTxEvents > 0 ? `(${numTxEvents})` : ''}
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
          key={TransactionIdPageTab.AvailableFunctions}
          label={'Available functions'}
          value={TransactionIdPageTab.AvailableFunctions}
          isActive={selectedTab === TransactionIdPageTab.AvailableFunctions}
          onClick={() => setSelectedTab(TransactionIdPageTab.AvailableFunctions)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.Transactions}
          label={`Transactions ${txCount > 0 ? `(${txCount})` : ''}`}
          value={TransactionIdPageTab.Transactions}
          isActive={selectedTab === TransactionIdPageTab.Transactions}
          onClick={() => setSelectedTab(TransactionIdPageTab.Transactions)}
        />
        <TabTriggerComponent
          key={TransactionIdPageTab.PostConditions}
          label={`Post-conditions ${numPostConditions > 0 ? `(${numPostConditions})` : ''}`}
          value={TransactionIdPageTab.PostConditions}
          isActive={selectedTab === TransactionIdPageTab.PostConditions}
          onClick={() => setSelectedTab(TransactionIdPageTab.PostConditions)}
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
  return null;
}

function TabsContentByTransactionType({ tx }: { tx: Transaction | MempoolTransaction }) {
  if (tx.tx_type === 'token_transfer') {
    return (
      <>
        <TabsContent
          key={TransactionIdPageTab.Overview}
          value={TransactionIdPageTab.Overview}
          w="100%"
        >
          <TabsContentContainer>
            <TxSummary tx={tx} />
          </TabsContentContainer>
        </TabsContent>
        <TabsContent key={TransactionIdPageTab.Events} value={TransactionIdPageTab.Events} w="100%">
          <Events tx={tx} />
        </TabsContent>
      </>
    );
  }
  if (tx.tx_type === 'contract_call') {
    return (
      <>
        <TabsContent
          key={TransactionIdPageTab.Overview}
          value={TransactionIdPageTab.Overview}
          w="100%"
        >
          <Grid templateColumns={{ base: '1fr', md: '75% 25%' }} gap={2}>
            <TabsContentContainer>
              <TxSummary tx={tx} />
            </TabsContentContainer>

            <DetailsCard tx={tx as Transaction} />
          </Grid>
        </TabsContent>
        <TabsContent
          key={TransactionIdPageTab.FunctionCall}
          value={TransactionIdPageTab.FunctionCall}
          w="100%"
        >
          <FunctionCalled tx={tx} />
        </TabsContent>
        <TabsContent
          key={TransactionIdPageTab.PostConditions}
          value={TransactionIdPageTab.PostConditions}
          w="100%"
        >
          <PostConditions tx={tx} />
        </TabsContent>
        <TabsContent key={TransactionIdPageTab.Events} value={TransactionIdPageTab.Events} w="100%">
          <Events tx={tx} />
        </TabsContent>
        <TabsContent key="sourceCode" value="sourceCode" w="100%">
          <Source tx={tx} />
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
    return (
      <>
        <TabsContent
          key={TransactionIdPageTab.Overview}
          value={TransactionIdPageTab.Overview}
          w="100%"
        >
          <Grid templateColumns={{ base: '1fr', md: '75% 25%' }} gap={2}>
            <TabsContentContainer>
              <TxSummary tx={tx} />
            </TabsContentContainer>

            <DetailsCard tx={tx as Transaction} />
          </Grid>
        </TabsContent>
        <TabsContent
          key={TransactionIdPageTab.AvailableFunctions}
          value={TransactionIdPageTab.AvailableFunctions}
          w="100%"
        >
          <AvailableFunctions tx={tx} />
        </TabsContent>
        <TabsContent
          key={TransactionIdPageTab.Transactions}
          value={TransactionIdPageTab.Transactions}
          w="100%"
        >
          <Transactions tx={tx} />
        </TabsContent>
        <TabsContent
          key={TransactionIdPageTab.PostConditions}
          value={TransactionIdPageTab.PostConditions}
          w="100%"
        >
          <PostConditions tx={tx} />
        </TabsContent>
        <TabsContent key={TransactionIdPageTab.Events} value={TransactionIdPageTab.Events} w="100%">
          <TabsContentContainer>
            <Events tx={tx} />
          </TabsContentContainer>
        </TabsContent>
        <TabsContent key="sourceCode" value="sourceCode" w="100%">
          <Source tx={tx} />
        </TabsContent>
      </>
    );
  }
  return null;
}

export const TxTabs = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  const [selectedTab, setSelectedTab] = useState(TransactionIdPageTab.Overview);

  let { data } = useAddressConfirmedTxsWithTransfers(
    'smart_contract' in tx ? tx.smart_contract.contract_id : '',
    DEFAULT_LIST_LIMIT,
    0,
    {
      staleTime: THIRTY_SECONDS,
      gcTime: THIRTY_SECONDS,
      enabled: 'smart_contract' in tx && !!tx.smart_contract?.contract_id, // Disabling this query if tx is not a smart contract tx
    }
  );

  const txCount = data?.total || 0;

  return (
    <TabsRoot
      variant="primary"
      size="redesignMd"
      defaultValue={TransactionIdPageTab.Overview}
      gap={2}
      rowGap={2}
      borderRadius="redesign.xl"
      w="full"
    >
      <Flex
        justifyContent={'space-between'}
        w="full"
        gap={2}
        flexDirection={{ base: 'column', sm: 'row' }}
        rowGap={2}
      >
        <ScrollIndicator>
          <TabsList>
            <TabsTriggersByTransactionType
              tx={tx}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              txCount={txCount}
            />
          </TabsList>
        </ScrollIndicator>

        {tx.tx_type === 'token_transfer' && (
          <Flex alignItems={'center'} gap={2}>
            <Text textStyle="text-regular-sm">Show:</Text>
            <ValueBasisFilterPopover />
          </Flex>
        )}
      </Flex>
      <TabsContentByTransactionType tx={tx} />
    </TabsRoot>
  );
};
