'use client';

import dayjs from 'dayjs';
import React from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TransactionStatus } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { Alert } from './Alert';

interface TxAlertsBaseProps {
  tx: Transaction | MempoolTransaction;
}
function TxAlertsBase({ tx }: TxAlertsBaseProps) {
  const networkMode = useGlobalContext().activeNetwork.mode;
  // for testnet, show after 4 hours. for mainnet, show after 24 hours
  const HOURS_NOTICE_TESTNET = 4;
  const HOURS_NOTICE_MAINNET = 24;
  const txStatus = getTransactionStatus(tx);
  const isFailed =
    tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition';
  const isLongPending =
    dayjs().diff(dayjs.unix((tx as any).receipt_time), 'h') >
    (networkMode === 'testnet' ? HOURS_NOTICE_TESTNET : HOURS_NOTICE_MAINNET);
  const isNonCanonical = txStatus === TransactionStatus.NON_CANONICAL;

  const failedMessage =
    tx.tx_status === 'abort_by_response'
      ? 'This transaction did not succeed because the transaction was aborted during its execution.'
      : 'This transaction would have succeeded, but was rolled back by a supplied post-condition.';

  const longPendingMessage =
    'Transactions that cannot be confirmed within 256 blocks are eventually canceled automatically.';

  const nonCanonicalMessage =
    'This transaction is in a non-canonical fork. It is not in the canonical Stacks chain.';

  return (
    <>
      {isFailed ? (
        <Alert
          error={{
            name: 'Notice',
            message: failedMessage,
          }}
        />
      ) : null}
      {isLongPending ? (
        <Alert
          error={{
            name: 'Notice',
            message: longPendingMessage,
          }}
        />
      ) : null}
      {isNonCanonical ? (
        <Alert
          error={{
            name: 'Notice',
            message: nonCanonicalMessage,
          }}
        />
      ) : null}
    </>
  );
}

export function TxAlerts(props: TxAlertsBaseProps) {
  return (
    <ExplorerErrorBoundary>
      <TxAlertsBase {...props} />
    </ExplorerErrorBoundary>
  );
}
