import * as React from 'react';
import { FC, memo, useMemo } from 'react';
import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TwoColsListItem } from '@common/components/TwoColumnsListItem';
import { ArrowDownIcon, ArrowUpIcon, ItemIcon } from '@components/item-icon';
import { Caption, Text, Title } from '@components/typography';
import { getTxTitle, truncateMiddle } from '@common/utils';
import { getTransactionTypeLabel } from '@components/token-transfer/utils';
import { Stack, Flex, color } from '@stacks/ui';
import { AddressArea, PrincipalLink, Timestamp } from '@components/transaction-item';
import { buildUrl } from '@components/links';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

interface TxsListItemProps {
  tx: Transaction;
}

const Icon: FC<{ tx: Transaction }> = memo(({ tx }) => <ItemIcon type={'tx'} tx={tx} />);

const LeftTitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <Title fontWeight="500" display="block" fontSize="16px">
    {getTxTitle(tx, true)}
  </Title>
));

const LeftSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
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
));

const RightTitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <Timestamp tx={tx} suppressHydrationWarning={true} />
));

const RightSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => {
  const isConfirmed = tx.tx_status === 'success';
  const isAnchored = !tx.is_unanchored;
  const didFail = !isConfirmed;
  return (
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
  );
});

export const TxsListItem: FC<TxsListItemProps> = memo(({ tx }) => {
  const activeNetworkMode = useAppSelector(selectActiveNetwork).mode;
  return (
    <TwoColsListItem
      icon={<Icon tx={tx} />}
      leftContent={{ title: <LeftTitle tx={tx} />, subtitle: <LeftSubtitle tx={tx} /> }}
      rightContent={{ title: <RightTitle tx={tx} />, subtitle: <RightSubtitle tx={tx} /> }}
      href={buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, activeNetworkMode)}
    />
  );
});

interface TransferListItemProps {
  tx: Transaction;
  title: string;
  sender?: string;
  recipient?: string;
  amount: string;
  isOriginator: boolean;
}

export const TransferListItem: FC<TransferListItemProps> = memo(
  ({ tx, title, sender, recipient, amount, isOriginator }) => {
    const activeNetworkMode = useAppSelector(selectActiveNetwork).mode;

    const icon = useMemo(
      () => (isOriginator ? <ArrowUpIcon /> : <ArrowDownIcon />),
      [isOriginator]
    );

    const leftTitle = useMemo(
      () => (
        <Title fontWeight="500" display="block" fontSize="16px">
          {title}
        </Title>
      ),
      [title]
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
          <Caption fontWeight="bold">Transfer</Caption>
          {isOriginator && recipient && (
            <Caption>
              To <PrincipalLink principal={recipient} />
            </Caption>
          )}
          {!isOriginator && sender && (
            <Caption>
              From <PrincipalLink principal={sender} />
            </Caption>
          )}
        </Stack>
      ),
      [isOriginator, sender, recipient]
    );

    const rightTitle = useMemo(
      () => (
        <Text ml="tight" fontSize="14px" textAlign="right" color={color('text-body')}>
          {amount}
        </Text>
      ),
      [amount]
    );

    return (
      <TwoColsListItem
        icon={icon}
        leftContent={{ title: leftTitle, subtitle: leftSubtitle }}
        rightContent={{ title: rightTitle, subtitle: null }}
        href={buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, activeNetworkMode)}
      />
    );
  }
);
