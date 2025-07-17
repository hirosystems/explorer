import { Alert as ChakraAlert } from '@/components/ui/alert';
import { Clock, Question, XCircle } from '@phosphor-icons/react';

export type AlertStatus = 'neutral' | 'warning' | 'error';

export function getAlertIcon(status: AlertStatus) {
  switch (status) {
    case 'error':
      return <XCircle weight="bold" />;
    case 'warning':
      return <Clock weight="bold" />;
    case 'neutral':
      return <Question weight="bold" />;
  }
}

export function Alert({
  status,
  title,
  description,
}: {
  status: AlertStatus;
  title?: string;
  description: string;
}) {
  return (
    <ChakraAlert
      status={status}
      title={title}
      description={description}
      icon={getAlertIcon(status)}
    />
  );
}

export function PendingAlert() {
  return (
    <Alert
      status="warning"
      title="Transaction taking longer than usual"
      description="Some transactions may be delayed if the tenure budget is full. A tenure budget refers to the limit on the number of tenures (periods during which a miner can produce blocks) that a miner can hold within a specific timeframe. If the tenure budget is full, it means the miner has reached the maximum number of tenures they can hold, potentially delaying the assignment of new tenures and affecting block production or transaction processing times."
    />
  );
}

export function TransactionDroppedAlert() {
  return (
    <Alert
      status="error"
      title="Transaction dropped"
      description="This transaction was dropped because it could not be mined. Dropped transactions do not incur mining fees and will expire after 256 tenures (~42 hours). Although they do not become part of the blockchain history, some indexers may continue to display data for these transactions for a limited time after expiration."
    />
  );
}

export function TransactionRolledBackAlert() {
  return (
    <Alert
      status="error"
      title="Transaction rolled back"
      description="This transaction would have succeeded but was rolled back due to a supplied post-condition. While a failed transaction is included in a block (with mining fees paid to the miner and non-refundable), it failed because it violated the rules of the Stacks protocol or the smart contract it interacted with. Refer to the error code and/or the contract for more details on the specific cause of failure."
    />
  );
}

export function TenureAlert() {
  return (
    <Alert
      status="neutral"
      description="A tenure is the period during which an individual miner is authorized to produce new blocks for the Stacks blockchain. Tenures change roughly every Bitcoin block when new miners are randomly elected, with Signers validating tenure changes or extensions to ensure secure transitions. Learn more."
    />
  );
}
