import * as React from 'react';
import { FC, memo, useMemo } from 'react';
import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { TwoColsListItem } from '@common/components/TwoColumnsListItem';
import { ItemIcon } from '@components/item-icon';
import { Caption, Title } from '@components/typography';
import { getTxTitle, truncateMiddle } from '@common/utils';
import { getTransactionTypeLabel } from '@components/token-transfer/utils';
import { Stack, Flex, color } from '@stacks/ui';
import { AddressArea, Nonce, Timestamp } from '@components/transaction-item';
import { buildUrl } from '@components/links';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { useCurrentStxPrice } from '@common/hooks/use-current-prices';

interface MempoolTxsListItemProps {
  tx: MempoolTransaction;
}

export const MempoolTxsListItem: FC<MempoolTxsListItemProps> = memo(({ tx }) => {
  const isPending = tx.tx_status === 'pending';
  const didFail = !isPending;
  const activeNetworkMode = useAppSelector(selectActiveNetwork).mode;
  const { data: currentStxPrice } = useCurrentStxPrice();

  const icon = useMemo(() => <ItemIcon type={'tx'} tx={tx} />, [tx]);

  const leftTitle = useMemo(
    () => (
      <Title fontWeight="500" display="block" fontSize="16px">
        {getTxTitle(tx, currentStxPrice)}
      </Title>
    ),
    []
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
    []
  );

  const rightTitle = useMemo(() => <Timestamp tx={tx} suppressHydrationWarning={true} />, []);

  const rightSubtitle = useMemo(
    () => (
      <Flex justifyContent="flex-end" alignItems="flex-end" flexWrap="wrap">
        <Caption
          mr="6px"
          as="span"
          data-test="tx-caption"
          color={didFail ? color('feedback-error') : color('invert')}
        >
          {isPending && 'Pending'}
          {didFail && 'Failed'}
        </Caption>
        {'·'}
        <Caption mt="1px" ml="6px" mr={isPending ? '6px' : undefined}>
          {truncateMiddle(tx.tx_id, 4)}
        </Caption>
        {isPending && <Nonce nonce={tx.nonce} />}
      </Flex>
    ),
    []
  );

  return (
    <TwoColsListItem
      icon={icon}
      leftContent={{ title: leftTitle, subtitle: leftSubtitle }}
      rightContent={{ title: rightTitle, subtitle: rightSubtitle }}
      href={buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, activeNetworkMode)}
    />
  );
});
