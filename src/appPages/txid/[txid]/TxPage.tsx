import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Block, MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { useGlobalContext } from '@/common/context/useAppContext';
import { hasStxBalance, hasTokenBalance } from '@/common/utils/accounts';
import { getTransactionStatus } from '@/common/utils/transactions';
import { TokenBalancesCard } from '@/components/balances/principal-token-balances';
import { StxBalances } from '@/components/balances/stx-balance-card';
import { TxAlerts } from '@/components/page';
import { Section } from '@/components/section';
import { Events } from '@/components/tx-events';
import { TxTitle } from '@/components/tx-title';
import { BlocksVisualizer } from '@/features/blocks-visualizer';
import { transactionQK, TransactionQueryKeys } from '@/features/transaction/query-keys';
import { useTransactionQueries } from '@/features/transaction/use-transaction-queries';
import { Box, Flex } from '@/ui/components';

import { TwoColumnPage } from '../../common/components/TwoColumnPage';
import { BtcAnchorBlockCard } from './Cards/BtcAnchorBlockCard';
import { ContractDetailsCard } from './Cards/ContractDetailsCard';

export function TxPage({
  tx,
  block,
  contractId,
  txDetails,
  children,
}: {
  tx: Transaction | MempoolTransaction;
  block?: Block;
  contractId?: string;
  txDetails: ReactNode;
  children?: ReactNode;
}) {
  const txStatus = getTransactionStatus(tx);
  const queries = useTransactionQueries();
  const { activeNetwork } = useGlobalContext();

  const showBlocksVisualizer =
    !activeNetwork.isSubnet && (txStatus === 'success_microblock' || txStatus === 'pending');

  const { data: balance } = useQuery(
    transactionQK(TransactionQueryKeys.accountBalance, contractId),
    queries.fetchAccountBalance(contractId),
    { enabled: !!contractId }
  );

  const isEmptyRightContent = !contractId && !block && !(contractId && balance);

  return (
    <TwoColumnPage
      title={
        <>
          <TxTitle data-test="txid-title" tx={tx} />
          <TxAlerts tx={tx} />
        </>
      }
      leftContent={
        <>
          {txDetails}
          {showBlocksVisualizer && (
            <Section title="Blocks">
              <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
                <Box width={['100%']} margin="24px 0">
                  <BlocksVisualizer />
                </Box>
              </Flex>
            </Section>
          )}
          {'events' in tx && <Events tx={tx} />}
          {children}
        </>
      }
      rightContent={
        !isEmptyRightContent && (
          <>
            {contractId && <ContractDetailsCard contractId={contractId} />}
            {block && <BtcAnchorBlockCard block={block} />}
            {contractId && balance && (
              <>
                {hasStxBalance(balance) && (
                  <Box mb={block ? '32px' : 'unset'}>
                    <StxBalances balances={balance} principal={contractId} />
                  </Box>
                )}
                {hasTokenBalance(balance) && <TokenBalancesCard balances={balance} />}
              </>
            )}
          </>
        )
      }
    />
  );
}
