import * as React from 'react';

import { ContractAvailableFunctions } from '../../../../common/components/ContractAvailableFunctions';
import { TabsContainer } from '../../../../common/components/TabsContainer';
import { AddressConfirmedTxsList } from '../../../../common/components/tx-lists/address-lists/AddressConfirmedTxsList';
import { AddressMempoolTxsList } from '../../../../common/components/tx-lists/address-lists/AddressMempoolTxsList';
import { useSuspenseContractById } from '../../../../common/queries/useContractById';
import { CodeEditor } from '../../../../ui/CodeEditor';
import { TabsProps } from '../../../../ui/Tabs';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { DeveloperData } from '../types';
import { Developers } from './Developers';

interface TokenTabsProps extends Partial<TabsProps> {
  tokenId: string;
  developerData?: DeveloperData;
}

export function TokenTabsBase({ tokenId, developerData, ...tabsProps }: TokenTabsProps) {
  const { data: contract } = useSuspenseContractById(tokenId);
  const source = contract?.source_code;
  return (
    <TabsContainer
      tabs={[
        {
          title: 'Confirmed',
          content: <AddressConfirmedTxsList address={tokenId} />,
        },
        {
          title: 'Pending',
          content: <AddressMempoolTxsList address={tokenId} />,
        },
        ...(!!source
          ? [
              {
                title: 'Source code',
                content: <CodeEditor code={source} height={500} />,
              },
            ]
          : []),
        ...(!!contract
          ? [
              {
                title: 'Available functions',
                content: <ContractAvailableFunctions contractId={tokenId} contract={contract} />,
              },
            ]
          : []),
        ...(!!developerData
          ? [
              {
                title: 'Developers',
                content: <Developers developerData={developerData} />,
              },
            ]
          : []),
      ]}
      actions={null}
      gridColumnEnd={'3'}
      {...tabsProps}
    />
  );
}

export function Tabs(props: TokenTabsProps) {
  return (
    <ExplorerErrorBoundary tryAgainButton>
      <TokenTabsBase {...props} />
    </ExplorerErrorBoundary>
  );
}
