import { useState } from 'react';

import { ContractAvailableFunctions } from '../../../../common/components/ContractAvailableFunctions';
import { TabsContainer } from '../../../../common/components/TabsContainer';
import { useSuspenseContractById } from '../../../../common/queries/useContractById';
import { AddressConfirmedTxsList } from '../../../../features/txs-list/AddressConfirmedTxsList';
import { AddressMempoolTxsList } from '../../../../features/txs-list/AddressMempoolTxsList';
import { CodeEditor } from '../../../../ui/CodeEditor';
import { TabsProps } from '../../../../ui/Tabs';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { DeveloperData, TokenInfoProps } from '../types';
import { Developers } from './Developers';
import HoldersTable from './holders/Holders';

interface TokenTabsProps extends Partial<TabsProps> {
  tokenId: string;
  tokenInfo: TokenInfoProps;
  developerData?: DeveloperData;
}

export function TokenTabsBase({ tokenId, tokenInfo, developerData }: TokenTabsProps) {
  const { data: contract } = useSuspenseContractById(tokenId);
  const source = contract?.source_code;
  const [tabId, setTabId] = useState('confirmed');
  return (
    <TabsContainer
      tabId={tabId}
      setTabId={setTabId}
      tabs={[
        {
          title: 'Confirmed',
          id: 'confirmed',
          content: <AddressConfirmedTxsList address={tokenId} />,
        },
        {
          title: 'Pending',
          id: 'pending',
          content: <AddressMempoolTxsList address={tokenId} />,
        },
        ...(!!source
          ? [
              {
                title: 'Source code',
                id: 'source',
                content: <CodeEditor code={source} height={500} />,
              },
            ]
          : []),
        ...(!!contract
          ? [
              {
                title: 'Available functions',
                id: 'available-functions',
                content: <ContractAvailableFunctions contractId={tokenId} contract={contract} />,
              },
            ]
          : []),
        ...(!!developerData
          ? [
              {
                title: 'Developers',
                id: 'developers',
                content: <Developers developerData={developerData} />,
              },
            ]
          : []),
        {
          title: 'Holders',
          id: 'holders',
          content: <HoldersTable tokenId={tokenId} tokenInfo={tokenInfo} />,
        },
      ]}
      actions={null}
      gridColumnEnd={'3'}
    />
  );
}

export function TokenTabs(props: TokenTabsProps) {
  return (
    <ExplorerErrorBoundary tryAgainButton>
      <TokenTabsBase {...props} />
    </ExplorerErrorBoundary>
  );
}
