import dynamic from 'next/dynamic';
import * as React from 'react';
import { ReactNode } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TwoColumnPage } from '../../../common/components/TwoColumnPage';
import { TxTypeTag } from '../../../common/components/TxTypeTag';
import { SkeletonTransactionDetails } from '../../../common/components/loaders/skeleton-transaction';
import { TxStatusLabel } from '../../../common/components/status';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { getTxTitle } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { PageTitle } from '../../_components/PageTitle';
import { BlocksVisualizer } from './BlocksVisualizer';
import { TxBtcAnchorBlockCard } from './Cards/TxBtcAnchorBlockCard';
import { Events } from './Events';
import { TxAlerts } from './TxAlerts';

const ContractDetailsCard = dynamic(
  () => import('./Cards/ContractDetailsCard').then(mod => mod.ContractDetailsCard),
  {
    ssr: false,
    loading: () => <SkeletonTransactionDetails />,
  }
);

const StxBalance = dynamic(
  () => import('../../address/[principal]/StxBalance').then(mod => mod.StxBalance),
  {
    ssr: false,
    loading: () => <SkeletonTransactionDetails />,
  }
);

const TokenBalanceCard = dynamic(
  () => import('../../address/[principal]/TokenBalanceCard').then(mod => mod.TokenBalanceCard),
  {
    ssr: false,
    loading: () => <SkeletonTransactionDetails />,
  }
);

export const TxPage: React.FC<{
  tx: Transaction | MempoolTransaction;
  contractId?: string;
  txDetails: ReactNode;
  children?: ReactNode;
}> = ({ tx, contractId, txDetails, children }) => {
  const txStatus = getTransactionStatus(tx);
  const { activeNetwork } = useGlobalContext();

  const showBlocksVisualizer =
    !activeNetwork.isSubnet && (txStatus === 'success_microblock' || txStatus === 'pending');

  return (
    <TwoColumnPage
      title={
        <Flex direction={'column'} gap={'8px'} width={'100%'}>
          <HStack gap="8px">
            <TxTypeTag
              color="white"
              bg="rgba(255,255,255,0.24)"
              type={tx.tx_type}
              flexShrink={'0'}
            />
            <TxStatusLabel status={getTransactionStatus(tx)} flexShrink={'0'} />
          </HStack>
          <PageTitle mt={'8px'}>{getTxTitle(tx)}</PageTitle>
          <TxAlerts tx={tx} />
        </Flex>
      }
      leftContent={
        <>
          {txDetails}
          {showBlocksVisualizer && <BlocksVisualizer />}
          {'events' in tx && <Events tx={tx} />}
          {children}
        </>
      }
      rightContent={
        <>
          {contractId && <ContractDetailsCard contractId={contractId} />}
          <TxBtcAnchorBlockCard tx={tx} />
          {contractId && (
            <>
              <StxBalance address={contractId} />
              <TokenBalanceCard address={contractId} />
            </>
          )}
        </>
      }
    />
  );
};
