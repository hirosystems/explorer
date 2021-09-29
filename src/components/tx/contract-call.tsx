import * as React from 'react';
import { Stack } from '@stacks/ui';

import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';
import { PostConditions } from '@components/post-conditions';
import { Events } from '@components/tx-events';
import { ContractDetails } from '@components/contract-details';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { PagePanes } from '@components/page-panes';
import { FunctionSummarySection } from '@components/function-summary/function-summary';
import {
  useBlockInView,
  useContractInfoInView,
  useContractSourceInView,
  useTransactionInView,
} from '../../hooks/currently-in-view-hooks';
import { useTransactionStatus } from '@common/hooks/use-transaction-status';
import { TransactionStatus } from '@common/constants';

const ContractCallPage = () => {
  const transaction = useTransactionInView();
  const block = useBlockInView();
  const source = useContractSourceInView();
  const info = useContractInfoInView();
  const txStatus = useTransactionStatus(transaction);
  const btc = null;

  if (!transaction || transaction.tx_type !== 'contract_call') return null;
  const isPending = txStatus === TransactionStatus.PENDING;
  const result = 'tx_result' in transaction && transaction.tx_result;

  return (
    <>
      <PageTop tx={transaction} />
      <PagePanes
        fullWidth={info || !!source ? false : transaction.tx_status === 'pending' || block === null}
      >
        <Stack spacing="extra-loose">
          <TransactionDetails transaction={transaction} />
          {'events' in transaction && transaction.events && (
            <Events txId={transaction.tx_id} events={transaction.events} />
          )}
          <FunctionSummarySection
            isPending={isPending}
            result={result}
            summary={transaction.contract_call}
            btc={btc}
            txStatus={txStatus}
          />
          <PostConditions
            conditions={transaction.post_conditions}
            mode={transaction.post_condition_mode}
          />
          {source && (
            <ContractSource
              sourceTx={transaction.contract_call.contract_id}
              source={source}
              contractCall={transaction.contract_call}
            />
          )}
        </Stack>
        <Stack spacing="extra-loose">
          {info && (
            <ContractDetails
              contractId={transaction.contract_call.contract_id}
              contractInterface={info}
            />
          )}
          {!isPending && block && <BtcAnchorBlockCard block={block} />}
        </Stack>
      </PagePanes>
    </>
  );
};

export default ContractCallPage;
