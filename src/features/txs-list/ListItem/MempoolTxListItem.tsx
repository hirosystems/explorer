import { FlexProps, Stack } from '@chakra-ui/react';
import { FC, memo, useMemo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { TxLink } from '../../../common/components/ExplorerLinks';
import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea, Nonce, TxTimestamp } from '../../../common/components/transaction-item';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { MICROSTACKS_IN_STACKS, truncateMiddleDeprecated } from '../../../common/utils/utils';
import { Caption, Title } from '../../../ui/typography';
import { TxTitle } from '../TxTitle';
import { getTransactionTypeLabel } from '../utils';

interface MempoolTxsListItemProps extends FlexProps {
  tx: MempoolTransaction;
}

// TODO: This component has too much overlap with TxListItem. We should refactor to remove this and to share more code.
export const MempoolTxListItem: FC<MempoolTxsListItemProps> = memo(({ tx, ...rest }) => {
  const isPending = tx.tx_status === 'pending';
  const didFail = !isPending;

  const icon = useMemo(
    () => <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />,
    [tx]
  );
  const leftTitle = useMemo(
    () => (
      <Title display="block" fontSize="sm" whiteSpace="nowrap">
        <TxTitle tx={tx} showPrice={true} />
      </Title>
    ),
    [tx]
  );

  const leftSubtitle = useMemo(
    () => (
      <Stack
        as="span"
        gap={1.5}
        direction={['column', 'column', 'row', 'row', 'row']}
        separator={
          <Caption display={['none', 'none', 'inline', 'inline', 'inline']} border="none">
            ∙
          </Caption>
        }
        flexWrap="nowrap"
      >
        <Caption fontWeight="semibold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
        <AddressArea tx={tx} />
        {Number(tx.fee_rate) > 0 ? (
          <Caption whiteSpace="nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>
            Fee: {`${Number(tx.fee_rate) / MICROSTACKS_IN_STACKS} STX`}
          </Caption>
        ) : null}
      </Stack>
    ),
    [tx]
  );

  const rightTitle = useMemo(
    () => (
      <Stack
        as="span"
        direction={['column', 'column', 'row', 'row', 'row']}
        separator={
          <Caption display={['none', 'none', 'inline', 'inline', 'inline']} border="none">
            ∙
          </Caption>
        }
        flexWrap="wrap"
        gap={1.5}
      >
        <TxLink txId={tx.tx_id}>{truncateMiddleDeprecated(tx.tx_id)}</TxLink>
        <TxTimestamp tx={tx} />
      </Stack>
    ),
    [tx]
  );

  const rightSubtitle = useMemo(
    () => (
      <Stack
        as="span"
        gap={1.5}
        direction={['column', 'column', 'row', 'row', 'row']}
        separator={
          <Caption display={['none', 'none', 'inline', 'inline', 'inline']} border="none">
            ∙
          </Caption>
        }
        flexWrap="wrap"
      >
        {didFail ? (
          <Caption as="span" data-test="tx-caption">
            "Failed"
          </Caption>
        ) : null}
        {isPending && <Nonce nonceVal={tx.nonce} whiteSpace="nowrap" />}
      </Stack>
    ),
    [didFail, isPending, tx.nonce]
  );

  return (
    <TwoColsListItem
      icon={icon}
      leftContent={{ title: leftTitle, subtitle: leftSubtitle }}
      rightContent={{ title: rightTitle, subtitle: rightSubtitle }}
      {...rest}
    />
  );
});
