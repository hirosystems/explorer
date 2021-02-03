import * as React from 'react';
import { Box, Stack } from '@stacks/ui';
import { TransactionList } from '@components/transaction-list';
import { StxBalances } from '@components/balances/stx-balance-card';
import { ContractSource } from '@components/contract-source';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { PostConditions } from '@components/post-conditions';

import { Block, SmartContractTransaction } from '@blockstack/stacks-blockchain-api-types';
import { TxData } from '@common/types/tx';
import { getContractName } from '@common/utils';
import { Events } from '@components/tx-events';
import { PagePanes } from '@components/page-panes';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { AllAccountData, fetchAllAccountData } from '@common/api/accounts';
import { useApiServer } from '@common/hooks/use-api';
import useSWR from 'swr';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { hasStxBalance, hasTokenBalance } from '@common/utils/accounts';

const SmartContractPage = ({
  transaction,
  block,
  account,
}: TxData<SmartContractTransaction> & { block?: Block; account?: AllAccountData }) => {
  const apiServer = useApiServer();
  const { data: accountData } = useSWR(
    [transaction.smart_contract.contract_id, 'SMART_CONTRACT_PAGE'],
    async () =>
      fetchAllAccountData(apiServer as any)({ principal: transaction.smart_contract.contract_id }),
    {
      initialData: account,
    }
  );
  return (
    <>
      <PageTop tx={transaction as any} />
      <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
        <Stack spacing="extra-loose">
          <TransactionDetails
            contractName={getContractName(transaction.smart_contract.contract_id)}
            transaction={transaction}
          />
          {'events' in transaction && <Events events={transaction.events} />}
          <ContractSource source={transaction.smart_contract.source_code} />
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
                  <StxBalances balances={accountData.balances} hasHadVesting={false} />
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
