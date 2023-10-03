import { useMemo } from 'react';
import { getTransactionTypeLabel } from '@/appPages/common/components/tx-lists/utils/tx';
import { useContractById } from '@/appPages/common/queries/useContractById';
import { useTxById } from '@/appPages/common/queries/useTxById';
import { useApi } from '@/common/api/client';
import { TransactionStatus } from '@/common/constants';
import { getContractId, toRelativeTime } from '@/common/utils';
import { getTransactionStatus } from '@/common/utils/transactions';
import { Meta } from '@/components/meta-head';
import { getDescription, getOgTitle } from '@/components/meta/transactions';

import { SkeletonPageWithTagsAndTwoColumns } from '../../components/loaders/skeleton-transaction';
import { useBlockByHash } from '../common/queries/useBlockByHash';
import { CoinbasePage } from './[txid]/CoinbasePage';
import { ContractCallPage } from './[txid]/ContractCall';
import { PoisonMicroblock } from './[txid]/PoisonMicroblock';
import { SmartContractPage } from './[txid]/SmartContractPage';
import { TokenTransferPage } from './[txid]/TokenTransfer';
import AppTxidPageError from '@/appPages/txid/[txid]/error';

export function Tx({
  txId,
  claritySyntax,
}: {
  txId: string;
  claritySyntax: Record<string, string>;
}) {
  const api = useApi();

  const isContractId = txId.includes('.');

  const {
    data: mainTx,
    isFetching: isMainTxFetching,
    error: mainTxError,
  } = useTxById(api, { txId }, { enabled: !isContractId, refetchOnWindowFocus: true });
  const {
    data: contract,
    isFetching: isContractFetching,
    error: contractError,
  } = useContractById(api, { contractId: txId }, { enabled: isContractId });
  const {
    data: contractTx,
    isFetching: isContractTxFetching,
    error: contractTxError,
  } = useTxById(api, { txId: contract?.tx_id || '' }, { enabled: !!contract?.tx_id });

  const tx = isContractId ? contractTx : mainTx;
  const hasBlockHash = tx && 'block_hash' in tx && tx.block_hash !== '0x';

  const {
    data: block,
    isFetching: isBlockFetching,
    error: blockError,
  } = useBlockByHash(api, { hash: hasBlockHash ? tx.block_hash : '' }, { enabled: hasBlockHash });

  const contractId = getContractId(txId, tx);
  const txStatus = useMemo(() => getTransactionStatus(tx), [tx]);

  if (isMainTxFetching || isContractFetching || isContractTxFetching || isBlockFetching)
    return <SkeletonPageWithTagsAndTwoColumns />;

  if (!!mainTxError || !!contractError || !!contractTxError || !!blockError || !tx)
    return (
      <AppTxidPageError error={mainTxError || contractError || contractTxError || blockError} />
    );

  const pageTitle = `${getTransactionTypeLabel(tx?.tx_type)}${
    txStatus === TransactionStatus.PENDING ? ' (Pending)' : ''
  }${txStatus === TransactionStatus.FAILED ? ' (Failed) ' : ''}`;
  const ogTitle = getOgTitle(tx);
  const ogUrl = `/txid/${tx.tx_id}`;
  const ogDescription = getDescription(tx);
  const labels =
    'burn_block_time' in tx
      ? [
          {
            label: 'Confirmed',
            data: `${toRelativeTime(tx.burn_block_time * 1000)}, in block #${tx.block_height}`,
          },
        ]
      : undefined;

  const TxMeta = () => (
    <Meta
      title={pageTitle}
      ogTitle={ogTitle}
      description={ogDescription}
      url={ogUrl}
      txStatus={txStatus}
      key={tx.tx_status}
      labels={labels}
    />
  );

  switch (tx.tx_type) {
    case 'coinbase':
      return (
        <>
          <TxMeta />
          <CoinbasePage tx={tx} block={block} />
        </>
      );
    case 'token_transfer':
      return (
        <>
          <TxMeta />
          <TokenTransferPage tx={tx} block={block} />
        </>
      );
    case 'contract_call':
      return (
        <>
          <TxMeta />
          <ContractCallPage
            tx={tx}
            block={block}
            contractId={contractId}
            claritySyntax={claritySyntax}
          />
        </>
      );
    case 'smart_contract':
      return (
        <>
          <TxMeta />
          <SmartContractPage
            tx={tx}
            block={block}
            contractId={contractId}
            claritySyntax={claritySyntax}
          />
        </>
      );
    case 'poison_microblock':
      return (
        <>
          <PoisonMicroblock tx={tx} block={block} />
        </>
      );
    default:
      return null;
  }
}
