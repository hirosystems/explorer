import { useSubscribeTx } from '@/app/_components/BlockList/Sockets/useSubscribeTx';
import { Button } from '@/ui/Button';
import { useCallback } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

function requestNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return;
    }
    Notification.requestPermission();
  }
}

function showNotification(title: string, options: NotificationOptions) {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}

export function TxSubscriptionButton({ tx }: { tx: Transaction | MempoolTransaction }) {
  const { toggleSubscription } = useSubscribeTx(tx.tx_id, tx => {
    showNotification('Transaction Status Update', {
      body: `Your transaction status has been updated. Transaction status: ${tx.tx_status}`,
    });
  });

  const onClickHandler = useCallback(() => {
    requestNotificationPermission();
    toggleSubscription(true);
  }, [toggleSubscription]);

  return (
    <Button
      onClick={onClickHandler}
      isDisabled={tx.tx_status !== 'pending'}
    >{`Turn on Transaction Status Notifications`}</Button>
  );
}
