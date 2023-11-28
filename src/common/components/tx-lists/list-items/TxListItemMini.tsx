import { FC, memo } from 'react';
import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { Stack } from '../../../../ui/Stack';
import { Caption, Title } from '../../../../ui/typography';
import { useGlobalContext } from '../../../context/useAppContext';
import { buildUrl } from '../../../utils/buildUrl';
import { getTransactionStatus } from '../../../utils/transactions';
import { TwoColsListItem } from '../../TwoColumnsListItem';
import { TxIcon } from '../../TxIcon';
import { AddressArea } from '../../transaction-item';
import { TxTitle } from '../common/utils/tx';
import { getTransactionTypeLabel } from '../utils/tx';

interface TxsListItemProps {
  tx: Transaction;
}

const Icon: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />
));

const LeftTitle: FC<{ tx: Transaction; href: string }> = memo(({ tx, href }) => (
  <Title fontWeight="500" display="block" fontSize="15px">
    {TxTitle(tx, href, true, true)}
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
