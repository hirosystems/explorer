import { buildUrl } from '@/app/common/utils/buildUrl';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { useGlobalContext } from '@/common/context/useAppContext';
import { getTransactionStatus } from '@/common/utils/transactions';
import { AddressArea } from '@/components/transaction-item';
import { Stack } from '@/ui/components';
import { Caption, Title } from '@/ui/typography';
import * as React from 'react';
import { FC, memo } from 'react';

import type { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxIcon } from '../../TxIcon';
import { useTxTitle } from '../common/utils/tx';
import { getTransactionTypeLabel } from '../utils/tx';

interface TxsListItemProps {
  tx: Transaction;
}

const Icon: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />
));

const LeftTitle: FC<{ tx: Transaction; href: string }> = memo(({ tx, href }) => (
  <Title fontWeight="500" display="block" fontSize="15px">
    {useTxTitle(tx, href, true, true)}
  </Title>
));

const LeftSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
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
));

export const TxListItemMini: FC<TxsListItemProps> = memo(({ tx }) => {
  const network = useGlobalContext().activeNetwork;
  const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);
  return (
    <TwoColsListItem
      icon={<Icon tx={tx} />}
      leftContent={{ title: <LeftTitle tx={tx} href={href} />, subtitle: <LeftSubtitle tx={tx} /> }}
    />
  );
});
