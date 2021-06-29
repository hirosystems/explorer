import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export const getTxErrorMessage = (tx: Transaction | MempoolTransaction): string | undefined => {
  switch (tx.tx_status) {
    case 'abort_by_post_condition':
      return 'This transaction would have succeeded, but was rolled back by a supplied post-condition.';
    case 'abort_by_response':
      return 'This transaction did not succeed because the transaction was aborted during its execution.';
    default:
      return undefined;
  }
};
