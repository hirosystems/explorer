import * as React from 'react';
import { Stack } from '@stacks/ui';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { ContractSource } from '@components/contract-source';
import { PostConditions } from '@components/post-conditions';
import { Events } from '@components/tx-events';
import { ContractCallTxs, TxData } from '@common/types/tx';
import { ContractDetails } from '@components/contract-details';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { PagePanes } from '@components/page-panes';
import { FunctionSummarySection } from '@components/function-summary/function-summary';

const ContractCallPage = ({
  transaction,
  source,
  block,
}: TxData<ContractCallTxs> & { block?: Block }) => {
  const isPending = transaction.tx_status === 'pending';
  return (
    <>
      <PageTop tx={transaction as any} />
      <PagePanes
        fullWidth={
          source?.contract?.contract_id
            ? false
            : transaction.tx_status === 'pending' || block === null
        }
      >
        <Stack spacing="extra-loose">
          <TransactionDetails transaction={transaction} />
          {'events' in transaction && transaction.events && <Events events={transaction.events} />}
          {!isPending && source.contract && (
            <FunctionSummarySection
              abi={source.contract.abi}
              result={transaction.tx_result}
              summary={transaction.contract_call}
            />
          )}
          <PostConditions
            conditions={transaction.post_conditions}
            mode={transaction.post_condition_mode}
          />
          {source.contract && (
            <ContractSource
              sourceTx={source.contract.contract_id}
              source={source.contract.source_code}
              contractCall={transaction.contract_call}
            />
          )}
        </Stack>
        <Stack spacing="extra-loose">
          {source?.contract?.contract_id && (
            <ContractDetails
              contractId={source?.contract?.contract_id}
              contractInterface={source.contract}
            />
          )}
          {!isPending && block && <BtcAnchorBlockCard block={block} />}
        </Stack>
      </PagePanes>
    </>
  );
};

export default ContractCallPage;
