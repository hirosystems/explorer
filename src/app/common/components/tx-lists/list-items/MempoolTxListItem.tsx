import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { useGlobalContext } from '@/common/context/useAppContext';
import { getTransactionStatus } from '@/common/utils/transactions';
import { buildUrl } from '@/app/common/utils/buildUrl';
import { AddressArea, Nonce, Timestamp } from '@/components/transaction-item';
import { Flex, FlexProps, Stack } from '@/ui/components';
import { Caption, Title } from '@/ui/typography';
import * as React from 'react';
import { FC, memo, useMemo } from 'react';

import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { TxIcon } from '../../TxIcon';
import { useTxTitle } from '../common/utils/tx';
import { getTransactionTypeLabel } from '../utils/tx';

interface MempoolTxsListItemProps extends FlexProps {
  tx: MempoolTransaction;
}

export const MempoolTxListItem: FC<MempoolTxsListItemProps> = memo(({ tx, ...rest }) => {
  const isPending = tx.tx_status === 'pending';
  const didFail = !isPending;
  const network = useGlobalContext().activeNetwork;

  const icon = useMemo(
    () => <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />,
    [tx]
  );
  const href = buildUrl(`/txid/${encodeURIComponent(tx.tx_id)}`, network);
  const txTitle = useTxTitle(tx, href, true);
  const leftTitle = useMemo(
    () => (
      <Title fontWeight="500" display="block" fontSize="16px">
        {txTitle}
      </Title>
    ),
    [txTitle]
  );

  const leftSubtitle = useMemo(
    () => (
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
    ),
    [tx]
  );

  const rightTitle = useMemo(() => <Timestamp tx={tx} />, []);

  const rightSubtitle = useMemo(
    () => (
      <Flex justifyContent="flex-end" alignItems="flex-end" flexWrap="wrap">
        <Caption
          mr="6px"
          as="span"
          data-test="tx-caption"
          color={didFail ? 'feedbackError' : 'invert'}
        >
          {isPending && 'Pending'}
          {didFail && 'Failed'}
        </Caption>
        {isPending && <Nonce nonce={tx.nonce} />}
      </Flex>
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
