import { Box, useColorMode } from '@chakra-ui/react';
import { FC, ReactNode, memo } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea, TxTimestamp } from '../../../common/components/transaction-item';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { MICROSTACKS_IN_STACKS, truncateMiddle } from '../../../common/utils/utils';
import { FlexProps } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
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
      <Caption whiteSpace={'nowrap'}>
        Fee: {`${(Number(tx.fee_rate) / MICROSTACKS_IN_STACKS).toFixed(4)} STX`}
      </Caption>
    ) : null}
  </HStack>
));

const RightTitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <HStack
    as="span"
    gap="1.5"
    alignItems="center"
    justifyContent="flex-end"
    flexWrap="nowrap"
    divider={<Caption>∙</Caption>}
    minWidth={'160px'}
    _hover={{ color: `links.${useColorMode().colorMode}`, textDecoration: 'underline' }}
  >
    <Box display={['none', 'none', 'inline']}>{truncateMiddle(tx.tx_id)}</Box>
    <TxTimestamp tx={tx} />
  </HStack>
));

const RightSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => {
  const isConfirmed = tx.tx_status === 'success';
  const isAnchored = !tx.is_unanchored;
  const didFail = !isConfirmed;
  const isInMicroblock = isConfirmed && !isAnchored;
  const isInAnchorBlock = isConfirmed && isAnchored;
  const colorMode = useColorMode().colorMode;
  const hash = isInMicroblock
    ? tx.microblock_hash
    : isInAnchorBlock
      ? tx.parent_block_hash
      : undefined;
  return (
    <HStack
      as="span"
      gap="1.5"
      alignItems="center"
      flexWrap="nowrap"
      divider={<Caption>∙</Caption>}
      minWidth={'160px'}
      color={'secondaryText'}
    >
      <Caption data-test="tx-caption" color={didFail ? 'error' : undefined} whiteSpace={'nowrap'}>
        {isConfirmed && !isAnchored && 'In microblock'}
        {isConfirmed && isAnchored && 'In anchor block'}
        {didFail && 'Failed'}
      </Caption>
      {hash && (
        <ExplorerLink
          href={`${isInMicroblock ? '/microblock' : '/block'}/${encodeURIComponent(hash)}`}
        >
          <Caption whiteSpace={'nowrap'}>{truncateMiddle(hash, 4)}</Caption>
        </ExplorerLink>
      )}
    </HStack>
  );
});

interface TxListItemContent {
  title?: ReactNode;
  subtitle?: ReactNode;
}

// const getMemPoolPageTxListContent = (
//   tx: Transaction
// ): {
//   left: TxListItemContent;
//   right: TxListItemContent;
// } => {

// };

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
