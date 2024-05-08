import { FC, ReactNode, memo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxLink } from '../../../common/components/ExplorerLinks';
import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea, Nonce, TxTimestamp } from '../../../common/components/transaction-item';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { MICROSTACKS_IN_STACKS, truncateMiddle } from '../../../common/utils/utils';
import { FlexProps } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { Stack } from '../../../ui/Stack';
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
}

const Icon: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />
));

const LeftTitle: FC<{ tx: Transaction }> = memo(({ tx }) => <TxTitle tx={tx} showPrice={true} />);

const LeftSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <Stack
    as="span"
    gap="1.5"
    alignItems={['flex-start', 'center', 'center', 'center']}
    justifyContent={['center', 'flex-start', 'flex-start', 'flex-start']}
    flexWrap="wrap"
    divider={<Caption display={['none', 'inline', 'inline', 'inline']}>∙</Caption>}
    direction={['column', 'row', 'row', 'row']}
  >
    <Caption fontWeight="semibold" whiteSpace="nowrap">
      {getTransactionTypeLabel(tx.tx_type)}
    </Caption>
    <AddressArea tx={tx} />
    {Number(tx.fee_rate) > 0 ? (
      <Caption whiteSpace={'nowrap'} style={{ fontVariantNumeric: 'tabular-nums' }}>
        Fee: {`${(Number(tx.fee_rate) / MICROSTACKS_IN_STACKS).toFixed(4)} STX`}
      </Caption>
    ) : null}
  </Stack>
));

const RightTitle: FC<{ tx: Transaction }> = memo(({ tx }) => {
  return (
    <HStack
      as="span"
      gap="1.5"
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="nowrap"
      divider={<Caption>∙</Caption>}
    >
      <Text whiteSpace="nowrap">
        <TxLink txId={tx.tx_id}>{truncateMiddle(tx.tx_id)}</TxLink>
      </Text>
      <Text whiteSpace="nowrap">
        <TxTimestamp tx={tx} />
      </Text>
    </HStack>
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
      gap="1.5"
      // flexWrap="nowrap"
      color={'textSubdued'}
      divider={<Caption display={['none', 'none', 'inline', 'inline']}>∙</Caption>}
      direction={['column', 'column', 'row', 'row']}
      justifyContent={['center', 'center', 'flex-end', 'flex-end']}
      alignItems={['flex-start', 'flex-start', 'center', 'center']}
      // minWidth={'160px'}
    >
      {didFail ? (
        <Caption data-test="tx-caption" color={didFail ? 'error' : undefined} whiteSpace={'nowrap'}>
          Failed
        </Caption>
      ) : (
        <HStack
          as="span"
          gap="1.5"
          alignItems="center"
          justifyContent="flex-end"
          flexWrap="nowrap"
          divider={<Caption>∙</Caption>}
        >
          <Caption whiteSpace={'nowrap'}>Block #{blockNumber}</Caption>
          <Nonce nonceVal={tx.nonce} whiteSpace="nowrap" />
        </HStack>
      )}
    </Stack>
  );
});

export const TxListItem: FC<TxsListItemProps> = memo(
  ({ tx, leftTitle, leftSubtitle, rightTitle, rightSubtitle, ...rest }) => {
    return (
      <TwoColsListItem
        icon={<Icon tx={tx} />}
        leftContent={{
          title: leftTitle || <LeftTitle tx={tx} />,
          subtitle: leftSubtitle || <LeftSubtitle tx={tx} />,
        }}
        rightContent={{
          title: rightTitle || <RightTitle tx={tx} />,
          subtitle: rightSubtitle || <RightSubtitle tx={tx} />,
        }}
        {...rest}
      />
    );
  }
);
