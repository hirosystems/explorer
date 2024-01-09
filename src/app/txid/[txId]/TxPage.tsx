import dynamic from 'next/dynamic';
import * as React from 'react';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { FiCheck } from 'react-icons/fi';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { PiCircleNotch } from 'react-icons/pi';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { getTxTypeIcon } from '../../../common/components/TxIcon';
import { MicroblockIcon } from '../../../common/components/icons/microblock';
import { SkeletonTransactionDetails } from '../../../common/components/loaders/skeleton-transaction';
import { TransactionType } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { getTxTitle } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Tag } from '../../../ui/Tag';
import { TagLabel } from '../../../ui/TagLabel';
import { TagLeftIcon } from '../../../ui/TagLeftIcon';
import { PageTitleWithTags } from '../../_components/PageTitle';
import { TowColLayout } from '../../_components/TwoColLayout';
import { BlocksVisualizer } from './BlocksVisualizer';
import { TxBtcAnchorBlockCard } from './Cards/TxBtcAnchorBlockCard';
import { Events } from './Events';
import { TxAlerts } from './TxAlerts';
import Skeleton from './skeleton';

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

const txTypeNamesMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract deploy',
  [TransactionType.CONTRACT_CALL]: 'Function call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
  tenure_change: 'Tenure change',
};

const txStatusIconMap: Record<string, IconType> = {
  pending: PiCircleNotch,
  success: FiCheck,
  success_anchor_block: FiCheck,
  success_microblock: () => <MicroblockIcon fill="white" />,
  non_canonical: HiOutlineExclamationCircle,
  failed: HiOutlineExclamationCircle,
  dropped: HiOutlineExclamationCircle,
};

const txStatusLabelMap = {
  pending: 'In mempool',
  success: 'Confirmed',
  success_anchor_block: 'Confirmed in anchor block',
  success_microblock: 'Included in microblock',
  non_canonical: 'Non-canonical (orphaned)',
  failed: 'Failed',
  dropped: 'Dropped',
};

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

  const [loading, setLoading] = React.useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  if (loading) return <Skeleton />;

  return (
    <>
      <PageTitleWithTags
        tags={
          <>
            <Tag>
              <TagLeftIcon as={getTxTypeIcon(tx.tx_type)} />
              <TagLabel>{txTypeNamesMap[tx.tx_type]}</TagLabel>
            </Tag>
            <Tag>
              <TagLeftIcon as={txStatusIconMap[getTransactionStatus(tx)]} />
              <TagLabel>{txStatusLabelMap[getTransactionStatus(tx)]}</TagLabel>
            </Tag>
          </>
        }
      >
        {getTxTitle(tx)}
      </PageTitleWithTags>
      <TowColLayout>
        <Flex direction={'column'} gap={7}>
          <TxAlerts tx={tx} />
          {txDetails}
          {showBlocksVisualizer && <BlocksVisualizer />}
          {'events' in tx && <Events tx={tx} />}
          {children}
        </Flex>
        <Flex direction={'column'} gap={7}>
          {contractId && <ContractDetailsCard contractId={contractId} />}
          <TxBtcAnchorBlockCard tx={tx} />
          {contractId && (
            <>
              <StxBalance address={contractId} />
              <TokenBalanceCard address={contractId} />
            </>
          )}
        </Flex>
      </TowColLayout>
    </>
  );
};
