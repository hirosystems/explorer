import { Box, Flex, FlexProps, Stack } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import {
  addSepBetweenStrings,
  getMemoString,
  toRelativeTime,
  truncateMiddle,
  getTxTitle,
} from '@common/utils';
import { forwardRefWithAs, memoWithAs } from '@stacks/ui-core';
import { getTransactionTypeLabel } from '@components/token-transfer/utils';

import { ArrowRightIcon } from '@components/icons/arrow-right';
import { Badge } from '@components/badge';
import { Link } from '@components/link';
import NextLink from 'next/link';
import React from 'react';
import { Transaction } from '@models/transaction.interface';
import { color } from '@components/color-modes';
import { useHarmonicIntervalFn } from 'react-use';
import { ItemIcon, getTxTypeIcon } from '@components/item-icon';
import { DropIcon } from '@components/icons/drop';
import { IconClock } from '@tabler/icons';

export { getTxTypeIcon };

export interface TxItemProps extends FlexProps {
  tx: Transaction | MempoolTransaction;
  minimal?: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
  target?: string;
  principal?: string;
  onClick?: any;
  onFocus?: any;
  onBlur?: any;
  tabIndex?: any;
  hideIcon?: boolean;
  hideRightElements?: boolean;
}

const getRelativeTimestamp = (tx: Transaction) => {
  const date =
    typeof (tx as any).burn_block_time !== 'undefined'
      ? toRelativeTime((tx as any).burn_block_time * 1000)
      : (tx as any).receipt_time
      ? toRelativeTime((tx as any).receipt_time * 1000)
      : 'Pending...';

  return date;
};

const Details = ({
  tx,
  minimal,
  principal,
  ...rest
}: { tx: Transaction; principal?: string; minimal?: boolean } & FlexProps) => {
  const date = getRelativeTimestamp(tx);

  useHarmonicIntervalFn(() => null, date.toLocaleLowerCase().includes('seconds') ? 1000 : 60000);

  const additional =
    (tx.tx_type === 'smart_contract' && tx?.events?.length) ||
    (tx.tx_type === 'contract_call' && tx?.events?.length)
      ? `${tx?.events?.length} events`
      : null;

  const sentOrReceived =
    tx.tx_type === 'token_transfer' && principal
      ? tx.sender_address === principal
        ? 'Sent'
        : 'Received'
      : null;

  const strings = minimal
    ? ([getTransactionTypeLabel(tx.tx_type), additional].filter(str => str) as string[])
    : ([getTransactionTypeLabel(tx.tx_type), sentOrReceived].filter(str => str) as string[]);

  return (
    <Caption
      alignItems={'center'}
      as="span"
      display="flex"
      textTransform="uppercase"
      fontWeight="600"
      {...rest}
    >
      {addSepBetweenStrings(strings)}
    </Caption>
  );
};

const PrincipalLink: React.FC<FlexProps & { principal: string }> = ({ principal, ...rest }) => (
  <Flex display="inline-flex" position={'relative'} zIndex={2} as="span" {...rest}>
    <NextLink href={`/address/${principal}`} passHref>
      <Caption
        as={Link}
        _hover={{
          textDecoration: 'underline',
        }}
        textDecoration="none"
      >
        {truncateMiddle(principal)}
      </Caption>
    </NextLink>
  </Flex>
);

const AddressArea = ({ tx, ...rest }: { tx: Transaction } & FlexProps) => {
  if (tx.tx_type === 'token_transfer') {
    return (
      <Stack isInline spacing="extra-tight" {...({ as: 'span', ...rest } as any)}>
        <Caption>from</Caption>
        <PrincipalLink principal={tx.sender_address} />
        <Flex as="span" color={color('text-caption')}>
          <ArrowRightIcon strokeWidth="1.5" size="15px" />
        </Flex>
        <PrincipalLink principal={tx.token_transfer.recipient_address} />
      </Stack>
    );
  }
  if (tx.tx_type === 'contract_call') {
    return (
      <Caption>
        by <PrincipalLink principal={tx.sender_address} />
      </Caption>
    );
  }
  if (tx.tx_type === 'smart_contract') {
    return (
      <Caption>
        by <PrincipalLink principal={tx.sender_address} />
      </Caption>
    );
  }
  return null;
};

const LargeVersion = ({
  tx,
  principal,
  hideIcon,
  hideRightElements,
  isHovered,
}: {
  tx: Transaction;
  principal?: string;
  hideIcon?: boolean;
  isHovered?: boolean;
  hideRightElements?: boolean;
}) => {
  const title = getTxTitle(tx);

  return (
    <>
      <Flex display="flex" as="span" alignItems="center">
        {!hideIcon ? (
          <ItemIcon mr="base" status={tx.tx_status} type="tx" txType={tx.tx_type} />
        ) : null}
        <Stack
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          as="span"
          spacing="tight"
        >
          <Stack alignItems="center" isInline spacing="base">
            <Title
              color={isHovered ? color('accent') : color('text-title')}
              fontWeight="500"
              display="block"
              fontSize="16px"
            >
              {title || truncateMiddle(tx.tx_id, 12)}
            </Title>
            {tx.tx_type === 'token_transfer' &&
            getMemoString(tx.token_transfer.memo)?.includes('Faucet') ? (
              <Badge
                bg={color('bg-light')}
                labelProps={{
                  display: 'flex',
                  alignItems: 'center',
                  color: color('text-body'),
                }}
              >
                <DropIcon color={color('accent')} size="14px" strokeWidth={2} />
                <Box ml="extra-tight">Faucet</Box>
              </Badge>
            ) : null}
          </Stack>
          <Stack
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            as="span"
            isInline
            spacing="extra-tight"
          >
            {tx.tx_status === 'pending' ? (
              <Caption fontWeight="bold" as="span" color={color('feedback-alert')}>
                Pending
              </Caption>
            ) : null}

            {tx.tx_status !== 'pending' && tx.tx_status !== 'success' ? (
              <Caption fontWeight="bold" mr="tight" as="span" color={color('feedback-error')}>
                Failed
              </Caption>
            ) : null}
            <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
            <AddressArea tx={tx} />
          </Stack>
        </Stack>
      </Flex>
      {!hideRightElements ? (
        <Flex
          display={['none', 'none', 'flex']}
          as="span"
          justifyContent="space-between"
          flexDirection="column"
          alignItems="flex-end"
        >
          <Text fontSize="14px" color={color('text-body')}>
            {getRelativeTimestamp(tx)}
          </Text>
          <Caption>{truncateMiddle(tx.tx_id, 6)}</Caption>
        </Flex>
      ) : null}
    </>
  );
};

export const TxItem = memoWithAs<TxItemProps, 'span'>(
  forwardRefWithAs<TxItemProps, 'span'>((props, ref) => {
    const {
      tx,
      isHovered,
      isFocused,
      minimal = false,
      as = 'span',
      principal,
      hideIcon,
      hideRightElements,
      ...rest
    } = props;
    return (
      <Flex
        justifyContent="space-between"
        alignItems="stretch"
        style={{ outline: 'none' }}
        py="loose"
        flexShrink={0}
        ref={ref}
        cursor={isHovered ? ['unset', 'unset', 'pointer'] : undefined}
        width="100%"
        as={as}
        {...rest}
        display="flex"
      >
        <LargeVersion
          isHovered={isHovered}
          hideRightElements={hideRightElements}
          hideIcon={hideIcon}
          principal={principal}
          tx={tx as any}
        />
      </Flex>
    );
  })
);
