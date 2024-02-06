import { Box } from '@chakra-ui/react';
import { FC, ReactNode, memo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea, TxTimestamp } from '../../../common/components/transaction-item';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { MICROSTACKS_IN_STACKS, truncateMiddle } from '../../../common/utils/utils';
import { FlexProps } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { TxLink } from '../../../ui/TxLink';
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

const LeftTitle: FC<{ tx: Transaction; href: string }> = memo(({ tx, href }) => (
  <>{TxTitle(tx, href, true)}</>
));

const LeftSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <HStack as="span" gap="1.5" alignItems="center" flexWrap="nowrap" divider={<Caption>∙</Caption>}>
    <Caption fontWeight="semibold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
    <AddressArea tx={tx} />
    {Number(tx.fee_rate) > 0 ? (
      <Caption whiteSpace={'nowrap'} style={{ fontVariantNumeric: 'tabular-nums' }}>
        Fee: {`${(Number(tx.fee_rate) / MICROSTACKS_IN_STACKS).toFixed(4)} STX`}
      </Caption>
    ) : null}
  </HStack>
));

const RightTitle: FC<{ tx: Transaction }> = memo(({ tx }) => {
  const network = useGlobalContext().activeNetwork;
  const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);

  return (
    <HStack
      as="span"
      gap="1.5"
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="nowrap"
      divider={<Caption>∙</Caption>}
      minWidth={'160px'}
    >
      <Box display={['none', 'none', 'inline']}>
        <TxLink href={href}>{truncateMiddle(tx.tx_id)}</TxLink>
      </Box>
      <TxTimestamp tx={tx} />
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
    <HStack
      as="span"
      gap="1.5"
      alignItems="center"
      flexWrap="nowrap"
      justifyContent="flex-end"
      divider={<Caption>∙</Caption>}
      minWidth={'160px'}
      color={'secondaryText'}
    >
      {didFail ? (
        <Caption data-test="tx-caption" color={didFail ? 'error' : undefined} whiteSpace={'nowrap'}>
          Failed
        </Caption>
      ) : (
        <Caption whiteSpace={'nowrap'}>Block #{blockNumber}</Caption>
      )}
    </HStack>
  );
});

export const TxListItem: FC<TxsListItemProps> = memo(
  ({ tx, leftTitle, leftSubtitle, rightTitle, rightSubtitle, ...rest }) => {
    const network = useGlobalContext().activeNetwork;
    const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);
    return (
      <TwoColsListItem
        icon={<Icon tx={tx} />}
        leftContent={{
          title: leftTitle || <LeftTitle tx={tx} href={href} />,
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
