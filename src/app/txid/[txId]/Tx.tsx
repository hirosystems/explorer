import * as React from 'react';

import { useSuspenseTxById } from '../../../common/queries/useTxById';
import { CoinbasePage } from './CoinbasePage';
import { ContractCallPage } from './ContractCall';
import { PoisonMicroblock } from './PoisonMicroblock';
import { SmartContractTx } from './SmartContract/SmartContractTx';
import { TenureChangePage } from './TenureChange';
import { TokenTransferPage } from './TokenTransfer';

export function Tx({ txId }: { txId: string }) {
  const { data: tx } = useSuspenseTxById(txId);

  if (tx.tx_type === 'coinbase') return <CoinbasePage tx={tx} />;

  if (tx.tx_type === 'token_transfer') return <TokenTransferPage tx={tx} />;

  if (tx.tx_type === 'poison_microblock') return <PoisonMicroblock tx={tx} />;

  if (tx.tx_type === 'contract_call') return <ContractCallPage tx={tx} />;

  if (tx.tx_type === 'smart_contract') return <SmartContractTx tx={tx} />;

  if (tx.tx_type === 'tenure_change') return <TenureChangePage tx={tx} />;

  return null;
}
