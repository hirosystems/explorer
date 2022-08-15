import * as React from 'react';
import { FC, memo, useMemo } from 'react';
import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TwoColsListItem } from '@common/components/TwoColumnsListItem';
import { ItemIcon } from '@components/item-icon';
import { Caption, Title } from '@components/typography';
import { getTxTitle, truncateMiddle } from '@common/utils';
import { getTransactionTypeLabel } from '@components/token-transfer/utils';
import { Stack, Flex, color } from '@stacks/ui';
import { AddressArea, Timestamp } from '@components/transaction-item';
import { buildUrl } from '@components/links';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

interface TxsListItemProps {
  tx: Transaction;
}

export const TxsListItem: FC<TxsListItemProps> = memo(({ tx }) => {
  const isConfirmed = tx.tx_status === 'success';
  const isAnchored = !tx.is_unanchored;
  const didFail = !isConfirmed;
  const activeNetworkUrl = useAppSelector(selectActiveNetwork).url;

  const icon = useMemo(() => <ItemIcon type={'tx'} tx={tx} />, [tx]);

  const leftTitle = useMemo(
    () => (
      <Title fontWeight="500" display="block" fontSize="16px">
        {getTxTitle(tx)}
      </Title>
    ),
    [tx]
  );

  const leftSubtitle = useMemo(
    () => (
      <Stack
        as="span"
        isInline
        spacing="extra-tight"
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

  const rightTitle = useMemo(() => <Timestamp tx={tx} suppressHydrationWarning={true} />, [tx]);

  const rightSubtitle = useMemo(
    () => (
      <Flex justifyContent="flex-end" alignItems="flex-end" flexWrap="wrap">
        <Caption
          mr="6px"
          as="span"
          data-test="tx-caption"
          color={didFail ? color('feedback-error') : color('invert')}
        >
          {isConfirmed && !isAnchored && 'In microblock'}
          {isConfirmed && isAnchored && 'In anchor block'}
          {didFail && 'Failed'}
        </Caption>
        {'·'}
        <Caption mt="1px" ml="6px">
          {truncateMiddle(tx.tx_id, 4)}
        </Caption>
      </Flex>
    ),
    [tx]
  );

  return (
    <TwoColsListItem
      icon={icon}
      leftContent={{ title: leftTitle, subtitle: leftSubtitle }}
      rightContent={{ title: rightTitle, subtitle: rightSubtitle }}
      href={buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, activeNetworkUrl)}
    />
  );
});
