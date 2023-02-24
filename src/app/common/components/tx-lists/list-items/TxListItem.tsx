import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { useGlobalContext } from '@/common/context/useAppContext';
import { truncateMiddle } from '@/common/utils';
import { getTransactionStatus } from '@/common/utils/transactions';
import { ExplorerLink, buildUrl } from '@/components/links';
import { AddressArea, Timestamp } from '@/components/transaction-item';
import { FlexProps, Stack } from '@/ui/components';
import { Caption, Title } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { FC, ReactNode, memo } from 'react';

import type { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxIcon } from '../../TxIcon';
import { useTxTitle } from '../common/utils/tx';
import { getTransactionTypeLabel } from '../utils/tx';

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
  <Title fontWeight="500" display="block" fontSize="15px">
    {useTxTitle(tx, href, true)}
  </Title>
));

const LeftSubtitle: FC<{ tx: Transaction }> = memo(({ tx }) => (
  <Stack
    as="span"
    isInline
    gap="4px"
    alignItems="center"
    flexWrap="wrap"
    divider={<Caption>∙</Caption>}
  >
    <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
    <AddressArea tx={tx} />
  </Stack>
));

const RightTitle: FC<{ tx: Transaction }> = memo(({ tx }) => <Timestamp tx={tx} />);

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
    <Stack
      as="span"
      isInline
      gap="4px"
      alignItems="center"
      flexWrap="wrap"
      divider={<Caption>∙</Caption>}
      minWidth={'160px'}
      justifyContent={'flex-end'}
    >
      <Caption as="span" data-test="tx-caption" color={didFail ? 'feedbackError' : 'invert'}>
        {isConfirmed && !isAnchored && 'In microblock'}
        {isConfirmed && isAnchored && 'In anchor block'}
        {didFail && 'Failed'}
      </Caption>
      {hash && (
        <ExplorerLink
          href={`${isInMicroblock ? '/microblock' : '/block'}/${encodeURIComponent(hash)}`}
        >
          <Caption
            as={'a'}
            color={`links.${colorMode}`}
            _hover={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            textDecoration="none"
          >
            {truncateMiddle(hash, 4)}
          </Caption>
        </ExplorerLink>
      )}
    </Stack>
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
