import { SectionTabsContentContainer, SectionTabsTrigger } from '@/common/components/SectionTabs';
import { TxDetails, TxDetailsOf } from '@/common/types/tx-v3';
import { isConfirmedTxDetails } from '@/common/utils/tx-details-utils';
import { TabsContent } from '@/ui/Tabs';
import { Grid, Stack } from '@chakra-ui/react';

import { getTxAlert } from './Alert';
import { DetailsCard } from './DetailsCard';
import { Events } from './Events';
import { TxHeader } from './TxHeader';
import { TransactionIdPageTab, TxTabs } from './TxTabs';
import { FunctionCalled } from './function-called/FunctionCalled';
import { PostConditions } from './post-conditions/PostConditions';
import { Source } from './source/Source';
import { TxSummary } from './tx-summary/TxSummary';

export const ContractCallPage = ({ tx }: { tx: TxDetails }) => {
  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} />
        {getTxAlert(tx)}
      </Stack>
      <TxTabs tx={tx} />
    </>
  );
};

export function ContractCallTabTriggers({
  tx,
  selectedTab,
}: {
  tx: TxDetailsOf<'contract_call'>;
  selectedTab: TransactionIdPageTab;
}) {
  const numPostConditions = tx.post_conditions?.length ?? 0;
  const numTxEvents = isConfirmedTxDetails(tx) ? tx.event_count : 0;

  return (
    <>
      <SectionTabsTrigger
        key={TransactionIdPageTab.Overview}
        label="Overview"
        value={TransactionIdPageTab.Overview}
        isActive={selectedTab === TransactionIdPageTab.Overview}
      />
      <SectionTabsTrigger
        key={TransactionIdPageTab.FunctionCall}
        label={'Function called'}
        value={TransactionIdPageTab.FunctionCall}
        isActive={selectedTab === TransactionIdPageTab.FunctionCall}
      />
      <SectionTabsTrigger
        key={TransactionIdPageTab.PostConditions}
        label={`Post-conditions`}
        secondaryLabel={numPostConditions > 0 ? `(${numPostConditions})` : ''}
        value={TransactionIdPageTab.PostConditions}
        isActive={selectedTab === TransactionIdPageTab.PostConditions}
      />
      <SectionTabsTrigger
        key={TransactionIdPageTab.Events}
        label={`Events`}
        secondaryLabel={numTxEvents > 0 ? `(${numTxEvents})` : ''}
        value={TransactionIdPageTab.Events}
        isActive={selectedTab === TransactionIdPageTab.Events}
      />
      <SectionTabsTrigger
        key={TransactionIdPageTab.SourceCode}
        label={'Source code'}
        value={TransactionIdPageTab.SourceCode}
        isActive={selectedTab === TransactionIdPageTab.SourceCode}
      />
    </>
  );
}

export function ContractCallTabContent({ tx }: { tx: TxDetailsOf<'contract_call'> }) {
  return (
    <>
      <TabsContent
        key={TransactionIdPageTab.Overview}
        value={TransactionIdPageTab.Overview}
        w="100%"
      >
        <Grid templateColumns={{ base: '1fr', md: '75% 25%' }} gap={2}>
          <SectionTabsContentContainer>
            <TxSummary tx={tx} />
          </SectionTabsContentContainer>
          <DetailsCard tx={tx} />
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
        <Source contractId={tx.contract_call.contract_id} />
      </TabsContent>
    </>
  );
}
