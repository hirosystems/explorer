import { FC, memo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea } from '../../../common/components/transaction-item';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { HStack } from '../../../ui/HStack';
import { Caption, Title } from '../../../ui/typography';
import { TxTitle } from '../TxTitle';
import { getTransactionTypeLabel } from '../utils';

interface TxsListItemProps {
  tx: Transaction;
}

const Icon: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />
));

const LeftTitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <Title fontWeight="500" display="block" fontSize="15px">
    <TxTitle tx={tx} showPrice={true} openInNewTab={true} />
  </Title>
));

const LeftSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <HStack as="span" gap="4px" alignItems="center" flexWrap="wrap" divider={<Caption>∙</Caption>}>
    <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
    <AddressArea tx={tx} />
  </HStack>
));

export const TxListItemMini: FC<TxsListItemProps> = memo(({ tx }) => {
  return (
    <TwoColsListItem
      icon={<Icon tx={tx} />}
      leftContent={{ title: <LeftTitle tx={tx} />, subtitle: <LeftSubtitle tx={tx} /> }}
    />
  );
});
