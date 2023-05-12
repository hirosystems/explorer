import { buildUrl } from '@/app/common/utils/buildUrl';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { useGlobalContext } from '@/common/context/useAppContext';
import { getTransactionStatus } from '@/common/utils/transactions';
import { AddressArea } from '@/components/transaction-item';
import { Stack } from '@/ui/components';
import { Caption, Title } from '@/ui/typography';
import * as React from 'react';
import { FC, memo, useMemo } from 'react';

import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { TxIcon } from '../../TxIcon';
import { useTxTitle } from '../common/utils/tx';
import { getTransactionTypeLabel } from '../utils/tx';

interface MempoolTxsListItemProps {
  tx: MempoolTransaction;
}

export const MempoolTxListItemMini: FC<MempoolTxsListItemProps> = memo(({ tx }) => {
  const network = useGlobalContext().activeNetwork;

  const icon = useMemo(
    () => <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />,
    [tx]
  );
  const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);

  const txTitle = useTxTitle(tx, href, true, true);

  const leftTitle = useMemo(
    () => (
      <Title fontWeight="500" display="block" fontSize="16px">
        {txTitle}
      </Title>
    ),
    [txTitle]
  );

  const leftSubtitle = useMemo(
    () => (
      <Stack
        as="span"
        isInline
        spacing="4px"
        alignItems="center"
        flexWrap="wrap"
        divider={<Caption>∙</Caption>}
      >
        <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
        <AddressArea tx={tx} />
      </Stack>
    ),
    [tx]
  );

  return <TwoColsListItem icon={icon} leftContent={{ title: leftTitle, subtitle: leftSubtitle }} />;
});
