import { useColorMode } from '@chakra-ui/react';
import { FC, ReactNode, memo } from 'react';
import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { FlexProps } from '../../../../ui/Flex';
import { Stack } from '../../../../ui/Stack';
import { Caption, Title } from '../../../../ui/typography';
import { useGlobalContext } from '../../../context/useAppContext';
import { buildUrl } from '../../../utils/buildUrl';
import { getTransactionStatus } from '../../../utils/transactions';
import { truncateMiddle } from '../../../utils/utils';
import { ExplorerLink } from '../../ExplorerLinks';
import { TwoColsListItem } from '../../TwoColumnsListItem';
import { TxIcon } from '../../TxIcon';
import { AddressArea, TxTimestamp } from '../../transaction-item';
import { TxTitle } from '../common/utils/tx';
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
    {TxTitle(tx, href, true)}
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

const RightTitle: FC<{ tx: Transaction }> = memo(({ tx }) => <TxTimestamp tx={tx} />);

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
