import React, { useMemo } from 'react';
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
import { TransactionStatus } from '@common/constants';
import { getTransactionStatus } from '@common/utils/transactions';
import { Block, MempoolContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from 'react-query';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types/generated';

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
  if (!contract) return null;

  const source = contract.source_code;
  const btc = null;
  const txStatus = useMemo(() => getTransactionStatus(transaction), [transaction]);
  const isPending = txStatus === TransactionStatus.PENDING;
  const result = 'tx_result' in transaction && transaction.tx_result;

  return (
    <>
      <PageTop tx={transaction} />
      <PagePanes
        fullWidth={
          contract || !!source ? false : transaction.tx_status === 'pending' || block === null
        }
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
