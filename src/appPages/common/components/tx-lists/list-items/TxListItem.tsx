import { useColorMode } from '@chakra-ui/react';

import { memo, ReactNode } from 'react';
import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { buildUrl } from '@/appPages/common/utils/buildUrl';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { useGlobalContext } from '@/common/context/useAppContext';
import { truncateMiddle } from '@/common/utils';
import { getTransactionStatus } from '@/common/utils/transactions';
import { ExplorerLink } from '@/components/links';
import { AddressArea, Timestamp } from '@/components/transaction-item';
import { FlexProps, Stack } from '@/ui/components';
import { Caption, Title } from '@/ui/typography';

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

const Icon = memo(({ tx }: { tx: Transaction }) => {
  return <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />;
});

const LeftTitle = memo(({ tx, href }: { tx: Transaction; href: string }) => {
  return (
    <Title fontWeight="500" display="block" fontSize="15px">
      {useTxTitle(tx, href, true)}
    </Title>
  );
});

const LeftSubtitle = memo(({ tx }: { tx: Transaction }) => {
  return (
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
  );
});

const RightTitle = memo(({ tx }: { tx: Transaction }) => {
  return <Timestamp tx={tx} />;
});

const RightSubtitle = memo(({ tx }: { tx: Transaction }) => {
  const isConfirmed = tx.tx_status === 'success';
  const isAnchored = !tx.is_unanchored;
  const didFail = !isConfirmed;
  const isInMicroblock = isConfirmed && !isAnchored;
  const isInAnchorBlock = isConfirmed && isAnchored;
  const { colorMode } = useColorMode();
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
      minWidth="160px"
      justifyContent="flex-end"
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
            as="a"
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

export const TxListItem = memo(
  ({ tx, leftTitle, leftSubtitle, rightTitle, rightSubtitle, ...rest }: TxsListItemProps) => {
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
