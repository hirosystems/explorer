'use client';

import { logError } from '@/common/utils/error-utils';
import { useIsRedesignUrl } from '@/common/utils/url-utils';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useTxIdPageData } from './TxIdPageContext';
import { getTxTag } from './page-data';
import { TenureChangePage as TenureChangePageRedesign } from './redesign/TenureChangePage';
import { TokenTransferPage as TokenTransferPageRedesign } from './redesign/TokenTransferPage';
import Skeleton from './skeleton';

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

const SmartContract = dynamic(() => import('./SmartContract/SmartContract'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const PoisonMicroblock = dynamic(() => import('./PoisonMicroblock'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const TokenTransferPage = dynamic(() => import('./TokenTransfer'), {
  loading: () => <Skeleton />,
  ssr: false,
});

const TenureChangePage = dynamic(() => import('./TenureChange'), {
  loading: () => <Skeleton />,
  ssr: false,
});

function TransactionIdPage() {
  const { initialTxData: tx, txId } = useTxIdPageData();
  const isRedesign = useIsRedesignUrl();

  // Revalidate tx-id page if tx is pending
  useEffect(() => {
    const revalidateTxIdPage = async () => {
      const txStatus = tx?.tx_status;
      if (txStatus === 'pending') {
        try {
          const revalidateUrl = `/api/revalidate?tag=${getTxTag(txId)}`;
          const revalidateResponse = await fetch(revalidateUrl);
          if (!revalidateResponse.ok) {
            throw new Error('Failed to revalidate tx id page for txId: ' + txId);
          }
        } catch (error) {
          logError(error as Error, 'Revalidating tx-id page for txId: ' + txId, { txId, txStatus });
        }
      }
    };

    revalidateTxIdPage();
  }, []);

  const isContractId = txId.includes('.');
  if (isContractId) {
    return <SmartContract contractId={txId} />;
  }

  if (tx?.tx_type === 'smart_contract') return <SmartContractTx tx={tx} />;

  if (tx?.tx_type === 'token_transfer' && isRedesign) return <TokenTransferPageRedesign tx={tx} />;
  if (tx?.tx_type === 'token_transfer') return <TokenTransferPage tx={tx} />;

  if (tx?.tx_type === 'tenure_change' && isRedesign) return <TenureChangePageRedesign tx={tx} />;
  if (tx?.tx_type === 'tenure_change') return <TenureChangePage tx={tx} />;

  if (tx?.tx_type === 'coinbase') return <CoinbasePage tx={tx} />;

  if (tx?.tx_type === 'contract_call') return <ContractCallPage tx={tx} />;

  if (tx?.tx_type === 'poison_microblock') return <PoisonMicroblock tx={tx} />;

  return null;
}

export default TransactionIdPage;
