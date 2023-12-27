import * as React from 'react';

import { useSuspenseContractById } from '../../../../common/queries/useContractById';
import { useSuspenseTxById } from '../../../../common/queries/useTxById';
import { AddressTxListTabs } from '../../../../features/txs-list/tabs/AddressTxListTabs';
import { PostConditions } from '../PostConditions';
import { TxPage } from '../TxPage';
import { ContractTabs } from './ContractTabs';
import { TxDetails } from './TxDetails';

export function SmartContract({ contractId }: { contractId: string }) {
  const { data: contract } = useSuspenseContractById(contractId);
  const { data: tx } = useSuspenseTxById(contract.tx_id);
  const source = contract.source_code;

  if (tx.tx_type !== 'smart_contract') return null;

  return (
    <TxPage tx={tx} contractId={contractId} txDetails={<TxDetails tx={tx} />}>
      <PostConditions tx={tx} />
      <ContractTabs source={source} contract={contract} contractId={contractId} />
      <AddressTxListTabs address={contractId} />
    </TxPage>
  );
}
