import * as React from 'react';
import { FC, memo, useMemo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { TxIcon } from '../../../common/components/TxIcon';
import { AddressArea, Nonce, TxTimestamp } from '../../../common/components/transaction-item';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { getTransactionStatus } from '../../../common/utils/transactions';
import { MICROSTACKS_IN_STACKS } from '../../../common/utils/utils';
import { FlexProps } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { Caption, Title } from '../../../ui/typography';
import { TxTitle } from '../TxTitle';
import { getTransactionTypeLabel } from '../utils';

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
  const txTitle = TxTitle(tx, href, true);
  const leftTitle = useMemo(
    () => (
      <Title display="block" fontSize="sm">
        {txTitle}
      </Title>
    ),
    [txTitle]
  );

  const leftSubtitle = useMemo(
    () => (
      <HStack
        as="span"
        gap="1.5"
        alignItems="center"
        flexWrap="wrap"
        divider={<Caption>∙</Caption>}
        color={'secondaryText'}
      >
        <Caption fontWeight="semibold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
        <AddressArea tx={tx} />
      </HStack>
    ),
    [tx]
  );

  const rightTitle = useMemo(() => <TxTimestamp tx={tx} />, [tx]);

  const rightSubtitle = useMemo(
    () => (
      <HStack
        as="span"
        gap="1.5"
        alignItems="center"
        flexWrap="nowrap"
        divider={<Caption>∙</Caption>}
        minWidth={'160px'}
        justifyContent={'flex-end'}
        color={'secondaryText'}
      >
        <Caption as="span" data-test="tx-caption">
          {isPending && 'Pending'}
          {didFail && 'Failed'}
        </Caption>
        {isPending && <Nonce nonce={tx.nonce} />}
        {Number(tx.fee_rate) > 0 ? (
          <Caption whiteSpace={'nowrap'}>
            fee: {`${Number(tx.fee_rate) / MICROSTACKS_IN_STACKS} STX`}
          </Caption>
        ) : null}
      </HStack>
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
