import { TransactionQueryKeys, transactionQK } from '@features/transaction/query-keys';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { Block, MempoolContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types/generated';
import { Stack } from '@stacks/ui';

import { TransactionStatus } from '@common/constants';
import { getTransactionStatus } from '@common/utils/transactions';

import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { ContractDetails } from '@components/contract-details';
import { ContractSource } from '@components/contract-source';
import { FunctionSummarySection } from '@components/function-summary/function-summary';
import { PageTop } from '@components/page';
import { PagePanes } from '@components/page-panes';
import { PostConditions } from '@components/post-conditions';
import { TransactionDetails } from '@components/transaction-details';
import { Events } from '@components/tx-events';

const ContractCallPage: React.FC<{
  transaction: ContractCallTransaction | MempoolContractCallTransaction;
  block?: Block;
  contractId?: string;
}> = ({ transaction, block, contractId }) => {
  const queries = useTransactionQueries();
  if (!contractId) return null;

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId)
  );

  const btc = null;
  const txStatus = useMemo(() => getTransactionStatus(transaction), [transaction]);
  const isPending = txStatus === TransactionStatus.PENDING;
  const result = 'tx_result' in transaction && transaction.tx_result;

  const source = contract?.source_code;

  return (
    <>
      <PageTop tx={transaction} />
      <PagePanes
        fullWidth={
          contract || !!source ? false : transaction.tx_status === 'pending' || block === null
        }
      >
        <Stack spacing="extra-loose">
          <TransactionDetails transaction={transaction} block={block} />
          {'events' in transaction && transaction.events && (
            <Events
              txId={transaction.tx_id}
              events={transaction.events}
              event_count={transaction.event_count}
            />
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
          <ContractSource
            sourceTx={transaction.contract_call.contract_id}
            source={source}
            contractCall={transaction.contract_call}
          />
        </Stack>
        <Stack spacing="extra-loose">
          {contract && (
            <ContractDetails
              contractId={transaction.contract_call.contract_id}
              contractInterface={contract}
            />
          )}
          {!isPending && block && <BtcAnchorBlockCard block={block} />}
        </Stack>
      </PagePanes>
    </>
  );
};

export default ContractCallPage;
