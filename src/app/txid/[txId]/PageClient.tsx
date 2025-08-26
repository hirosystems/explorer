'use client';

import { useIsRedesignUrl } from '@/common/utils/url-utils';
import dynamic from 'next/dynamic';

import { useTxIdPageData } from './TxIdPageContext';
import { CoinbasePage as CoinbasePageRedesign } from './redesign/CoinbasePage';
import { ContractCallPage as ContractCallPageRedesign } from './redesign/ContractCallPage';
import { TenureChangePage as TenureChangePageRedesign } from './redesign/TenureChangePage';
import { TokenTransferPage as TokenTransferPageRedesign } from './redesign/TokenTransferPage';
import Skeleton from './skeleton';

const ContractCallPage = dynamic(() => import('./ContractCall'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const SmartContractTx = dynamic(() => import('./SmartContract/SmartContractTx'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const SmartContract = dynamic(() => import('./SmartContract/SmartContract'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const PoisonMicroblock = dynamic(() => import('./PoisonMicroblock'), {
  loading: () => <Skeleton />,
  ssr: false,
});

function TransactionIdPage() {
  const { initialTxData: tx, txId } = useTxIdPageData();
  const isRedesign = useIsRedesignUrl();

  const isContractId = txId.includes('.');
  if (isContractId) {
    return <SmartContract contractId={txId} />;
  }

  if (tx?.tx_type === 'smart_contract') return <SmartContractTx tx={tx} />;

  if (tx?.tx_type === 'token_transfer') return <TokenTransferPageRedesign tx={tx} />;

  if (tx?.tx_type === 'tenure_change') return <TenureChangePageRedesign tx={tx} />;

  if (tx?.tx_type === 'coinbase') return <CoinbasePageRedesign tx={tx} />;

  if (tx?.tx_type === 'contract_call' && isRedesign) return <ContractCallPageRedesign tx={tx} />;
  if (tx?.tx_type === 'contract_call') return <ContractCallPage tx={tx} />;

  if (tx?.tx_type === 'poison_microblock') return <PoisonMicroblock tx={tx} />;

  return null;
}

export default TransactionIdPage;
