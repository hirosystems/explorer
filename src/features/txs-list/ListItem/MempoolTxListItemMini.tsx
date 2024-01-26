import { FC, memo, useMemo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea } from '../../../common/components/transaction-item';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { HStack } from '../../../ui/HStack';
import { Caption, Title } from '../../../ui/typography';
import { TxTitle } from '../TxTitle';
import { getTransactionTypeLabel } from '../utils';

interface MempoolTxsListItemProps {
  tx: MempoolTransaction;
}

export const MempoolTxListItemMini: FC<MempoolTxsListItemProps> = memo(({ tx }) => {
  const icon = useMemo(
    () => <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />,
    [tx]
  );

  const leftTitle = useMemo(
    () => (
      <Title fontWeight="500" display="block" fontSize="16px">
        <TxTitle tx={tx} showPrice={true} openInNewTab={true} />
      </Title>
    ),
    [tx]
  );

  const leftSubtitle = useMemo(
    () => (
      <HStack
        as="span"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        divider={<Caption>∙</Caption>}
        color={'secondaryText'}
      >
        <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
        <AddressArea tx={tx} />
      </HStack>
    ),
    [tx]
  );

  return <TwoColsListItem icon={icon} leftContent={{ title: leftTitle, subtitle: leftSubtitle }} />;
});
