import * as React from 'react';

import {
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { AddressTxListTabs } from '../../../../common/components/tx-lists/tabs/AddressTxListTabs';
import { useSuspenseContractById } from '../../../../common/queries/useContractById';
import { getTxContractId } from '../../../../common/utils/utils';
import { PostConditions } from '../PostConditions';
import { TxPage } from '../TxPage';
import { ContractTabs } from './ContractTabs';
import { TxDetails } from './TxDetails';

export function SmartContractTx({
  tx,
}: {
  tx: SmartContractTransaction | MempoolSmartContractTransaction;
}) {
  const txContractId = getTxContractId(tx);
  const { data: contract } = useSuspenseContractById(txContractId);
  const source = contract.source_code;

  return (
    <TxPage tx={tx} contractId={txContractId} txDetails={<TxDetails tx={tx} />}>
      <PostConditions tx={tx} />
      <ContractTabs source={source} contract={contract} contractId={txContractId} />
      <AddressTxListTabs address={txContractId} />
    </TxPage>
  );
}
