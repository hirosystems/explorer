import { AccountTransactionList } from '@features/account-transaction-list';
import { TransactionQueryKeys, transactionQK } from '@features/transaction/query-keys';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import * as React from 'react';
import { FC, useState } from 'react';
import { useQuery } from 'react-query';

import { Block, SmartContractTransaction } from '@stacks/stacks-blockchain-api-types';
import { ClarityAbiFunction } from '@stacks/transactions';
import { Box, Button, Flex, Stack, color } from '@stacks/ui';

import { useAppDispatch } from '@common/state/hooks';
import { ContractWithParsedAbi } from '@common/types/contract';
import { getContractName, isPendingTx } from '@common/utils';
import { hasStxBalance, hasTokenBalance } from '@common/utils/accounts';

import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { StxBalances } from '@components/balances/stx-balance-card';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { ContractSource } from '@components/contract-source';
import { Link } from '@components/link';
import { PageTop } from '@components/page';
import { PagePanes } from '@components/page-panes';
import { PostConditions } from '@components/post-conditions';
import { TransactionDetails } from '@components/transaction-details';
import { Events } from '@components/tx-events';
import { Caption, Text } from '@components/typography';

import { TabsWrapper } from '@modules/Tabs/TabsWrapper';
import { Tabs } from '@modules/TransactionList/components/Tabs';
import { AbiFunction } from '@modules/sandbox/components/ContractCall/AvailableFunctionsView';
import { FunctionView } from '@modules/sandbox/components/ContractCall/FunctionView';
import { useUser } from '@modules/sandbox/hooks/useUser';
import { setUserData } from '@modules/sandbox/sandbox-slice';

const ContractTabs: FC<{
  contractId: string;
  source?: string;
  contract?: ContractWithParsedAbi;
}> = ({ contractId, source, contract }) => {
  const { isConnected, connect } = useUser();
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [functionName, setFunctionName] = useState('');
  const sourceCodeSelected = !!source && currentIndex === 0;
  if (sourceCodeSelected) {
    return (
      <TabsWrapper
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        bgColor={'#000'}
        px={'none'}
        Title={() => (
          <Tabs
            tabs={[...(!!source ? ['Source code'] : []), 'Available functions']}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
      >
        <ContractSource source={source} />
      </TabsWrapper>
    );
  }
  if (contract) {
    return (
      <TabsWrapper
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        px={'none'}
        Title={() => (
          <Tabs
            tabs={[...(!!source ? ['Source code'] : []), 'Available functions']}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
      >
        {!isConnected ? (
          <Flex alignItems={'center'} justifyContent={'center'} py={'loose'}>
            <Button
              onClick={() =>
                connect({
                  onFinish: authData => {
                    dispatch(setUserData({ userData: authData.userSession.loadUserData() }));
                  },
                })
              }
            >
              Connect Stacks Wallet
            </Button>
          </Flex>
        ) : functionName ? (
          <FunctionView
            contractId={contractId}
            fn={
              contract?.abi?.functions?.find(
                (fn: any) => fn.name === functionName
              ) as unknown as ClarityAbiFunction
            }
            cancelButton={
              <Link onClick={() => setFunctionName('')}>
                <Caption _hover={{ cursor: 'pointer', color: color('text-title') }} mt="base">
                  Cancel
                </Caption>
              </Link>
            }
          />
        ) : (
          contract?.abi?.functions.map(
            (abiFn: any) =>
              abiFn.access !== 'private' && (
                <AbiFunction
                  abiFn={abiFn}
                  onClick={() => {
                    setFunctionName(abiFn.name);
                  }}
                />
              )
          )
        )}
      </TabsWrapper>
    );
  }
  return null;
};

const SmartContractPage: React.FC<{
  transaction: SmartContractTransaction;
  block?: Block;
  contractId?: string;
}> = ({ transaction, block, contractId }) => {
  const queries = useTransactionQueries();

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId),
    { enabled: !!contractId }
  );

  const { data: balance } = useQuery(
    transactionQK(TransactionQueryKeys.accountBalance, contractId),
    queries.fetchAccountBalance(contractId),
    { enabled: !!contractId }
  );

  const source = contract?.source_code;

  if (!contractId) return null;

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
            <Events
              txId={transaction.tx_id}
              events={transaction.events}
              event_count={transaction.event_count}
            />
          )}
          <PostConditions
            mode={transaction.post_condition_mode}
            conditions={transaction.post_conditions}
          />
          <ContractTabs source={source} contract={contract} contractId={contractId} />
          <AccountTransactionList contractId={contractId} />
        </Stack>
        <Box>
          {block && <BtcAnchorBlockCard mb="extra-loose" block={block} />}
          {balance && (
            <>
              {hasStxBalance(balance) && (
                <Box mb={block ? 'extra-loose' : 'unset'}>
                  <StxBalances balances={balance} principal={contractId} />
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
