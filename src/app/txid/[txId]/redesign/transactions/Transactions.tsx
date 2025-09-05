'use client';

import { AddressTxsTable } from '@/common/components/table/table-examples/AddressTxsTable';

import {
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

export function Transactions({
  tx,
}: {
  tx: SmartContractTransaction | MempoolSmartContractTransaction;
}) {
  return <AddressTxsTable principal={tx.smart_contract?.contract_id} initialData={undefined} />;
}
