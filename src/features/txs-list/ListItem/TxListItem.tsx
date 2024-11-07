import { FlexProps, Stack } from '@chakra-ui/react';
import { FC, ReactNode, memo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxLink } from '../../../common/components/ExplorerLinks';
import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea, Nonce, TxTimestamp } from '../../../common/components/transaction-item';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { MICROSTACKS_IN_STACKS, truncateMiddle } from '../../../common/utils/utils';
import { Text } from '../../../ui/Text';
import { Caption } from '../../../ui/typography';
import { TxTitle } from '../TxTitle';
import { getTransactionTypeLabel } from '../utils';

interface TxsListItemProps extends FlexProps {
  tx: Transaction;
  leftTitle?: ReactNode;
  leftSubtitle?: ReactNode;
  rightTitle?: ReactNode;
  rightSubtitle?: ReactNode;
  simple?: boolean;
}

const Icon: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />
));

const LeftTitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <Text whiteSpace="nowrap" height={6}>
    <TxTitle tx={tx} showPrice={true} />
  </Text>
));

const LeftSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <Stack
    as="span"
    direction={['column', 'column', 'row', 'row', 'row']}
    separator={
      <Caption
        border="none"
        className="separator"
        display={['none', 'none', 'inline', 'inline', 'inline']}
      >
        ∙
      </Caption>
    }
    flexWrap="wrap"
    gap={1.5}
  >
    <Caption fontWeight="semibold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
    <AddressArea tx={tx} />
    {Number(tx.fee_rate) > 0 ? (
      <Caption whiteSpace="nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>
        Fee: {`${(Number(tx.fee_rate) / MICROSTACKS_IN_STACKS).toFixed(4)} STX`}
      </Caption>
    ) : null}
  </Stack>
));

const RightTitle: FC<{ tx: Transaction }> = memo(({ tx }) => {
  return (
    <Stack
      as="span"
      direction={['column', 'column', 'row', 'row', 'row']}
      separator={
        <Caption border="none" display={['none', 'none', 'inline', 'inline', 'inline']}>
          ∙
        </Caption>
      }
      flexWrap="wrap"
      gap={1.5}
      alignItems={['normal', 'normal', 'center', 'center', 'center']}
      height={['auto', 'auto', '6', '6', '6']}
    >
      <TxLink txId={tx.tx_id}>{truncateMiddle(tx.tx_id)}</TxLink>
      <TxTimestamp tx={tx} />
    </Stack>
  );
});

const RightSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => {
  const isConfirmed = tx.tx_status === 'success';
  const isAnchored = !tx.is_unanchored;
  const didFail = !isConfirmed;
  const isInMicroblock = isConfirmed && !isAnchored;
  const isInAnchorBlock = isConfirmed && isAnchored;
  const blockNumber = isInMicroblock || isInAnchorBlock ? tx.block_height : undefined;
  return (
    <Stack
      as="span"
      gap={1.5}
      direction={['column', 'column', 'row', 'row', 'row']}
      separator={
        <Caption border="none" display={['none', 'none', 'inline', 'inline', 'inline']}>
          ∙
        </Caption>
      }
      flexWrap="wrap"
    >
      {didFail ? (
        <Caption data-test="tx-caption" color={didFail ? 'error' : undefined} whiteSpace="nowrap">
          Failed
        </Caption>
      ) : (
        <Stack
          as="span"
          direction={['column', 'column', 'row', 'row', 'row']}
          separator={
            <Caption border="none" display={['none', 'none', 'inline', 'inline', 'inline']}>
              ∙
            </Caption>
          }
          flexWrap="wrap"
          gap={1.5}
        >
          <Caption whiteSpace="nowrap">Block #{blockNumber}</Caption>
          <Nonce nonceVal={tx.nonce} whiteSpace="nowrap" />
        </Stack>
      )}
    </Stack>
  );
});

export const TxListItem: FC<TxsListItemProps> = memo(
  ({ tx, leftTitle, leftSubtitle, rightTitle, rightSubtitle, simple, ...rest }) => {
    return (
      <TwoColsListItem
        icon={<Icon tx={tx} />}
        leftContent={{
          title: leftTitle || <LeftTitle tx={tx} />,
          subtitle: leftSubtitle || <LeftSubtitle tx={tx} />,
        }}
        rightContent={
          simple
            ? undefined
            : {
                title: rightTitle || <RightTitle tx={tx} />,
                subtitle: rightSubtitle || <RightSubtitle tx={tx} />,
              }
        }
        {...rest}
      />
    );
  }
);
