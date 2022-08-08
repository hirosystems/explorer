import { getContractName, isPendingTx } from '@common/utils';
import { hasStxBalance, hasTokenBalance } from '@common/utils/accounts';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { StxBalances } from '@components/balances/stx-balance-card';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { ContractSource } from '@components/contract-source';
import { PageTop } from '@components/page';
import { PagePanes } from '@components/page-panes';
import { PostConditions } from '@components/post-conditions';
import { TransactionDetails } from '@components/transaction-details';
import { Events } from '@components/tx-events';
import { AccountTransactionList } from '@features/account-transaction-list';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import { Block, SmartContractTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Stack } from '@stacks/ui';
import * as React from 'react';
import { useQuery } from 'react-query';

const SmartContractPage: React.FC<{
  transaction: SmartContractTransaction;
  block?: Block;
  contractId?: string;
}> = ({ transaction, block, contractId }) => {
  const queries = useTransactionQueries();
  if (!contractId) return null;

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId)
    // TODO no refetch
  );

  const { data: balance } = useQuery(
    transactionQK(TransactionQueryKeys.accountBalance, contractId),
    queries.fetchAccountBalance(contractId)
  );

  const source = contract?.source_code;

  return (
    <>
      <PageTop tx={transaction} />
      <PagePanes fullWidth={isPendingTx(transaction) || block === null}>
        <Stack spacing="extra-loose">
          <TransactionDetails
            contractName={getContractName(transaction.smart_contract.contract_id)}
            transaction={transaction}
            block={block}
          />
          {'events' in transaction && (
            <Events txId={transaction.tx_id} events={transaction.events} />
          )}
          <PostConditions
            mode={transaction.post_condition_mode}
            conditions={transaction.post_conditions}
          />
          {source && <ContractSource source={source} />}
          <AccountTransactionList contractId={contractId} />
        </Stack>
        <Box>
          {block && <BtcAnchorBlockCard mb="extra-loose" block={block} />}
          {balance && (
            <>
              {hasStxBalance(balance) && (
                <Box mb={block ? 'extra-loose' : 'unset'}>
                  <StxBalances
                    balances={balance}
                    unlocking={{ found: false }}
                    hasHadVesting={false}
                    principal={contractId}
                  />
                </Box>
              )}
              {hasTokenBalance(balance) && <TokenBalancesCard balances={balance} />}
            </>
          )}
        </Box>
      </PagePanes>
    </>
  );
};

export default SmartContractPage;
