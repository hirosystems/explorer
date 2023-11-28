import { FC, memo, useMemo } from 'react';
import * as React from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

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

  const txTitle = TxTitle(tx, href, true, true);

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
