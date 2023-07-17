'use client';

import { TabsProps } from '@/ui/Tabs';
import { FC } from 'react';
import { TabsContainer } from '@/app/common/components/TabsContainer';
import { AddressConfirmedTxsList } from '@/app/common/components/tx-lists/address-lists/AddressConfirmedTxsList';
import { AddressMempoolTxsList } from '@/app/common/components/tx-lists/address-lists/AddressMempoolTxsList';
import { useApi } from '@/common/api/client';
import { useContractById } from '@/app/common/queries/useContractById';
import { claritySyntax } from '@/app/common/claritySyntax';
import { CodeEditor } from '@/ui/CodeEditor';
import { ContractAvailableFunctions } from '@/app/common/components/ContractAvailableFunctions';
import { TokenInfoProps } from '@/pages/token/[tokenId]';
import { Developers } from '@/app/token/[tokenId]/Tabs/Developers';

export const Tabs: FC<
  {
    tokenId: string;
    developerData?: TokenInfoProps['extended']['developerData'];
  } & Partial<TabsProps>
> = ({ tokenId, developerData, ...tabsProps }) => {
  const api = useApi();
  const { data: contract } = useContractById(api, { contractId: tokenId }, { enabled: !!tokenId });
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
                content: <CodeEditor code={source} claritySyntax={claritySyntax} height={500} />,
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
};
