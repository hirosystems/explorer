import { useColorMode } from '@chakra-ui/react';
import { FC, memo, useMemo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

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
  const colorMode = useColorMode().colorMode;

  const icon = useMemo(
    () => <TxIcon txType={tx.tx_type} txStatus={getTransactionStatus(tx)} />,
    [tx]
  );
  const leftTitle = useMemo(
    () => (
      <Title display="block" fontSize="sm">
        <TxTitle tx={tx} showPrice={true} />
      </Title>
    ),
    [tx]
  );

  const leftSubtitle = useMemo(
    () => (
      <Stack
        as="span"
        gap="1.5"
        alignItems={['flex-start', 'center', 'center', 'center']}
        justifyContent={['center', 'flex-start', 'flex-start', 'flex-start']}
        flexWrap="nowrap"
        divider={<Caption display={['none', 'inline', 'inline', 'inline']}>∙</Caption>}
        direction={['column', 'row', 'row', 'row']}
      >
        <Caption fontWeight="semibold" whiteSpace="nowrap">
          {getTransactionTypeLabel(tx.tx_type)}
        </Caption>
        <AddressArea tx={tx} />
        {Number(tx.fee_rate) > 0 ? (
          <Caption whiteSpace={'nowrap'} style={{ fontVariantNumeric: 'tabular-nums' }}>
            Fee: {`${Number(tx.fee_rate) / MICROSTACKS_IN_STACKS} STX`}
          </Caption>
        ) : null}
      </Stack>
    ),
    [tx]
  );

  const rightTitle = useMemo(
    () => (
      <HStack
        as="span"
        gap={1.5}
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
    ),
    [tx]
  );

  const rightSubtitle = useMemo(
    () => (
      <Stack
        as="span"
        gap="1.5"
        flexWrap="nowrap"
        color={'secondaryText'}
        divider={<Caption display={['none', 'none', 'inline', 'inline']}>∙</Caption>}
        direction={['column', 'column', 'row', 'row']}
        justifyContent={['center', 'center', 'flex-end', 'flex-end']}
        alignItems={['flex-start', 'flex-start', 'center', 'center']}
        minWidth={'160px'}
      >
        {didFail ? (
          <Caption as="span" data-test="tx-caption">
            "Faild"
          </Caption>
        ) : null}
        {isPending && <Nonce nonce={tx.nonce} />}
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
