'use client';

import dayjs from 'dayjs';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TransactionStatus } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { ListItem } from '../../../ui/ListItem';
import { Text } from '../../../ui/Text';
import { UnorderedList } from '../../../ui/UnorderedList';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { AlertBase } from './Alert';
import { useWhyDidMyTxFail } from './useWhyDidMyTxFail';

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

  const { data } = useWhyDidMyTxFail(tx.tx_id);
  const messages = (
    data?.results?.map((result: { message?: string }) => result.message) || []
  )?.filter((message: string) => !!message);

  const failedMessage =
    tx.tx_status === 'abort_by_response'
      ? 'This transaction did not succeed because the transaction was aborted during its execution'
      : 'This transaction would have succeeded, but was rolled back by a supplied post-condition';

  const longPendingMessage =
    'Transactions that cannot be confirmed within 256 blocks are eventually canceled automatically';

  const nonCanonicalMessage =
    'This transaction is in a non-canonical fork. It is not in the canonical Stacks chain';

  if (messages?.length) {
    return (
      <AlertBase
        status={'warning'}
        message={
          <>
            <Text>{failedMessage}:</Text>
            <UnorderedList mt={2}>
              {messages.map((message: string) => (
                <ListItem>{message}</ListItem>
              ))}
            </UnorderedList>
          </>
        }
      />
    );
  }

  return (
    <>
      {isFailed ? <AlertBase status={'warning'} message={failedMessage} /> : null}
      {isLongPending ? <AlertBase status={'warning'} message={longPendingMessage} /> : null}
      {isNonCanonical ? <AlertBase status={'warning'} message={nonCanonicalMessage} /> : null}
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
