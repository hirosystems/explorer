import { isConfirmedTxDetails } from '@/app/txid/[txId]/tx-details-utils';
import { SectionTabsContentContainer, SectionTabsTrigger } from '@/common/components/SectionTabs';
import { TxDetails, TxDetailsOf } from '@/common/types/tx-v3';
import { TabsContent } from '@/ui/Tabs';
import { Stack } from '@chakra-ui/react';

import { getTxAlert } from './Alert';
import { Events } from './Events';
import { TxHeader } from './TxHeader';
import { TransactionIdPageTab, TxTabs } from './TxTabs';
import { TxSummary } from './tx-summary/TxSummary';

export const TokenTransferPage = ({ tx }: { tx: TxDetails }) => {
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

export function TokenTransferTabTriggers({
  tx,
  selectedTab,
}: {
  tx: TxDetailsOf<'token_transfer'>;
  selectedTab: TransactionIdPageTab;
}) {
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
        key={TransactionIdPageTab.Events}
        label={`Events`}
        secondaryLabel={numTxEvents > 0 ? `(${numTxEvents})` : ''}
        value={TransactionIdPageTab.Events}
        isActive={selectedTab === TransactionIdPageTab.Events}
      />
    </>
  );
}

export function TokenTransferTabContent({ tx }: { tx: TxDetailsOf<'token_transfer'> }) {
  return (
    <>
      <TabsContent
        key={TransactionIdPageTab.Overview}
        value={TransactionIdPageTab.Overview}
        w="100%"
      >
        <SectionTabsContentContainer>
          <TxSummary tx={tx} />
        </SectionTabsContentContainer>
      </TabsContent>
      <TabsContent key={TransactionIdPageTab.Events} value={TransactionIdPageTab.Events} w="100%">
        <Events tx={tx} />
      </TabsContent>
    </>
  );
}
