import { getIsSBTC } from '@/app/tokens/utils';

import { ContractAvailableFunctions } from '../../../../common/components/ContractAvailableFunctions';
import { TabsContainer } from '../../../../common/components/TabsContainer';
import { useSuspenseContractById } from '../../../../common/queries/useContractById';
import { AddressConfirmedTxsList } from '../../../../features/txs-list/AddressConfirmedTxsList';
import { AddressMempoolTxsList } from '../../../../features/txs-list/AddressMempoolTxsList';
import { CodeEditor } from '../../../../ui/CodeEditor';
import { TabsProps } from '../../../../ui/Tabs';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { sbtcDepositAddress } from '../consts';
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
  const isSBTC = getIsSBTC(tokenId);
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
        ...(isSBTC
          ? [
              {
                title: 'Confirmed Deposits',
                content: <AddressConfirmedTxsList address={sbtcDepositAddress} />,
              },
            ]
          : []),
        ...(isSBTC
          ? [
              {
                title: 'Pending Deposits',
                content: <AddressMempoolTxsList address={sbtcDepositAddress} />,
              },
            ]
          : []),
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

        {
          title: 'Holders',
          content: <HoldersTable tokenId={tokenId} tokenInfo={tokenInfo} />,
        },
      ]}
      actions={null}
      gridColumnEnd={'3'}
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
