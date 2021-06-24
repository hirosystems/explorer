import * as React from 'react';
import { Box, Stack } from '@stacks/ui';
import { TransactionList } from '@components/transaction-list';
import { StxBalances } from '@components/balances/stx-balance-card';
import { ContractSource } from '@components/contract-source';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { PostConditions } from '@components/post-conditions';
import { getContractName } from '@common/utils';
import { Events } from '@components/tx-events';
import { PagePanes } from '@components/page-panes';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { hasStxBalance, hasTokenBalance } from '@common/utils/accounts';
import {
  useBlockInView,
  useContractSourceInView,
  useTransactionInView,
} from '@common/hooks/use-transaction-in-view';

const SmartContractPage = () => {
  const transaction = useTransactionInView();
  const block = useBlockInView();
  const source = useContractSourceInView();
  const accountData: any = undefined;
  if (!transaction || transaction.tx_type !== 'smart_contract') return null;
  return (
    <>
      <PageTop tx={transaction as any} />
      <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
        <Stack spacing="extra-loose">
          <TransactionDetails
            contractName={getContractName(transaction.smart_contract.contract_id)}
            transaction={transaction}
          />
          {'events' in transaction && (
            <Events txId={transaction.tx_id} events={transaction.events} />
          )}
          {source && <ContractSource source={source.source} />}
          <PostConditions
            mode={transaction.post_condition_mode}
            conditions={transaction.post_conditions}
          />
          {accountData?.transactions?.results && accountData?.transactions?.results.length > 1 ? (
            <TransactionList
              mempool={accountData?.pendingTransactions}
              showCoinbase
              hideFilter
              principal={transaction.smart_contract.contract_id}
              transactions={accountData?.transactions?.results}
            />
          ) : null}
        </Stack>
        <Box>
          {block && <BtcAnchorBlockCard mb="extra-loose" block={block} />}
          {accountData?.balances && (
            <>
              {hasStxBalance(accountData.balances) && (
                <Box mb={block ? 'extra-loose' : 'unset'}>
                  <StxBalances
                    balances={accountData.balances}
                    unlocking={{ found: false }}
                    hasHadVesting={false}
                  />
                </Box>
              )}
              {hasTokenBalance(accountData.balances) && (
                <TokenBalancesCard balances={accountData.balances} />
              )}
            </>
          )}
        </Box>
      </PagePanes>
    </>
  );
};

export default SmartContractPage;
