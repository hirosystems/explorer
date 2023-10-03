import { memo } from 'react';
import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { buildUrl } from '@/appPages/common/utils/buildUrl';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { useGlobalContext } from '@/common/context/useAppContext';
import { getTransactionStatus } from '@/common/utils/transactions';
import { AddressArea } from '@/components/transaction-item';
import { Stack } from '@/ui/components';
import { Caption, Title } from '@/ui/typography';

import { TxIcon } from '../../TxIcon';
import { useTxTitle } from '../common/utils/tx';
import { getTransactionTypeLabel } from '../utils/tx';

interface TxsListItemProps {
  tx: Transaction;
}

const Icon = memo(({ tx }: { tx: Transaction }) => {
  return <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />;
});

const LeftTitle = memo(({ tx, href }: { tx: Transaction; href: string }) => {
  return (
    <Title fontWeight="500" display="block" fontSize="15px">
      {useTxTitle(tx, href, true, true)}
    </Title>
  );
});

const LeftSubtitle = memo(({ tx }: { tx: Transaction }) => {
  return (
    <Stack
      as="span"
      isInline
      gap="4px"
      alignItems="center"
      flexWrap="wrap"
      divider={<Caption>∙</Caption>}
    >
      <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
      <AddressArea tx={tx} />
    </Stack>
  );
});

export const TxListItemMini = memo(({ tx }: TxsListItemProps) => {
  const network = useGlobalContext().activeNetwork;
  const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);
  return (
    <TwoColsListItem
      icon={<Icon tx={tx} />}
      leftContent={{ title: <LeftTitle tx={tx} href={href} />, subtitle: <LeftSubtitle tx={tx} /> }}
    />
  );
});
