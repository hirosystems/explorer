'use client';

import { useIsRedesignUrl } from '@/common/utils/url-utils';

import { useSuspenseTxById } from '../../../common/queries/useTxById';
import { CoinbasePage } from './CoinbasePage';
import { ContractCallPage } from './ContractCall';
import { PoisonMicroblock } from './PoisonMicroblock';
import { SmartContract } from './SmartContract/SmartContract';
import { SmartContractTx } from './SmartContract/SmartContractTx';
import { TenureChangePage } from './TenureChange';
import { TokenTransferPage as TokenTransferPageRedesign } from './redesign/TokenTransferPage';

function Tx({ txId }: { txId: string }) {
  const { data: tx } = useSuspenseTxById(txId);
  const isRedesign = useIsRedesignUrl();

  if (tx.tx_type === 'coinbase') return <CoinbasePage tx={tx} />;

  if (tx.tx_type === 'token_transfer') return <TokenTransferPageRedesign tx={tx} />;
  // if (tx.tx_type === 'token_transfer' && isRedesign) return <TokenTransferPageRedesign tx={tx} />;
  // if (tx.tx_type === 'token_transfer') return <TokenTransferPage tx={tx} />;

  if (tx.tx_type === 'poison_microblock') return <PoisonMicroblock tx={tx} />;

  if (tx.tx_type === 'contract_call') return <ContractCallPage tx={tx} />;

  if (tx.tx_type === 'smart_contract') return <SmartContractTx tx={tx} />;

  if (tx.tx_type === 'tenure_change') return <TenureChangePage tx={tx} />;

  return null;
}

function TransactionIdPage({ txId }: { txId: string }) {
  const isContractId = txId.includes('.');
  if (isContractId) {
    return <SmartContract contractId={txId} />;
  }
  return <Tx txId={txId} />;
}

export default TransactionIdPage;
