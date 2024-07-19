import { StacksApiSocketClient } from '@stacks/blockchain-api-client';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useSubscribe } from './useSubscribe';

export function useSubscribeTx(
  txId: string,
  handleTx: (tx: Transaction | MempoolTransaction) => void,
  handleConnect?: (client: StacksApiSocketClient) => void,
  handleDisconnect?: (client: StacksApiSocketClient | null) => void,
  handleError?: (client: StacksApiSocketClient | null) => void
) {
  const subscribeAction = (client: StacksApiSocketClient) =>
    client.subscribeTransaction(txId, tx => {
      handleTx(tx);
    });

  const { subscription, subscriptionIsOn, toggleSubscription } = useSubscribe(
    subscribeAction,
    handleConnect,
    handleDisconnect,
    handleError
  );

  return {
    toggleSubscription,
    subscriptionIsOn,
    subscription,
  };
}
