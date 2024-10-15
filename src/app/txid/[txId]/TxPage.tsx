import { Check, CircleNotch, Icon, WarningCircle } from '@phosphor-icons/react';
import * as React from 'react';
import { ReactNode } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { getTxTypeIcon } from '../../../common/components/TxIcon';
import { TransactionType } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { getTxTitle } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Tag } from '../../../ui/Tag';
import { TagLabel } from '../../../ui/TagLabel';
import { TagLeftIcon } from '../../../ui/TagLeftIcon';
import { PageTitleWithTags } from '../../_components/PageTitle';
import { TowColLayout } from '../../_components/TwoColLayout';
import { StxBalance } from '../../address/[principal]/StxBalance';
import { TokenBalanceCard } from '../../address/[principal]/TokenBalanceCard';
import { BlocksVisualizer } from './BlocksVisualizer';
import { ContractDetailsCard } from './Cards/ContractDetailsCard';
import { TxBtcAnchorBlockCard } from './Cards/TxBtcAnchorBlockCard';
import { Events } from './Events';
import { TxAlerts } from './TxAlerts';

const txTypeNamesMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract deploy',
  [TransactionType.CONTRACT_CALL]: 'Function call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
  tenure_change: 'Tenure change',
};

const txStatusIconMap: Record<string, Icon> = {
  pending: CircleNotch,
  success: Check,
  success_anchor_block: Check,
  non_canonical: WarningCircle,
  failed: WarningCircle,
  dropped: WarningCircle,
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
  const { activeNetwork, activeNetworkKey } = useGlobalContext();
  const isMainnet = activeNetworkKey === 'https://api.hiro.so';

  const showBlocksVisualizer =
    isMainnet &&
    !activeNetwork.isSubnet &&
    (txStatus === 'success_microblock' || txStatus === 'pending');

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
