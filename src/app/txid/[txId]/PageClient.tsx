'use client';

import { useIsRedesignUrl } from '@/common/utils/url-utils';
import dynamic from 'next/dynamic';

import { useTxIdPageData } from './TxIdPageContext';
import { TokenTransferPage as TokenTransferPageRedesign } from './redesign/TokenTransferPage';
import Skeleton from './skeleton';

const test = 'test';

const CoinbasePage = dynamic(() => import('./CoinbasePage'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const ContractCallPage = dynamic(() => import('./ContractCall'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const SmartContractTx = dynamic(() => import('./SmartContract/SmartContractTx'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const TenureChangePage = dynamic(() => import('./TenureChange'), {
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

  // console.log('rendering tx_id', tx?.tx_id, 'tx_type', tx?.tx_type);
  if (tx?.tx_type === 'smart_contract') return <SmartContractTx tx={tx} />;

  if (tx?.tx_type === 'token_transfer') return <TokenTransferPageRedesign tx={tx} />;
  // if (tx.tx_type === 'token_transfer' && isRedesign) return <TokenTransferPageRedesign tx={tx} />;
  // if (tx.tx_type === 'token_tr ansfer') return <TokenTransferPage tx={tx} />;

  if (tx?.tx_type === 'tenure_change') return <TenureChangePage tx={tx} />;

  if (tx?.tx_type === 'coinbase') return <CoinbasePage tx={tx} />;

  if (tx?.tx_type === 'contract_call') return <ContractCallPage tx={tx} />;

  if (tx?.tx_type === 'poison_microblock') return <PoisonMicroblock tx={tx} />;

  return null;
}

export default TransactionIdPage;
