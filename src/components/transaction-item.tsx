import { Box, BoxProps, Flex, FlexProps, Stack } from '@stacks/ui';
import { Caption, Title } from '@components/typography';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import {
  addSepBetweenStrings,
  border,
  getMemoString,
  microToStacks,
  toRelativeTime,
  truncateMiddle,
} from '@common/utils';
import { forwardRefWithAs } from '@stacks/ui-core';
import { getTransactionTypeLabel } from '@components/token-transfer/utils';

import { ArrowRightIcon } from '@components/icons/arrow-right';
import { Badge } from '@components/badge';
import { CodeIcon } from '@components/icons/code';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { Link } from '@components/link';
import NextLink from 'next/link';
import React from 'react';
import { Transaction } from '@models/transaction.interface';
import { ContractCallIcon } from '@components/icons/contract-call';
import { color } from '@components/color-modes';
import { getContractName } from '@common/utils';
import { StxInline } from '@components/icons/stx-inline';
import { useHarmonicIntervalFn } from 'react-use';

export const getTxTypeIcon = (txType: Transaction['tx_type']): React.FC<BoxProps> => {
  let Icon = StxInline;
  if (txType === 'smart_contract') {
    Icon = CodeIcon as any;
  } else if (txType === 'contract_call') {
    Icon = ContractCallIcon as any;
  }
  return Icon;
};

export const ItemIcon = React.memo(
  ({
    type,
    opacity,
    status,
    ...rest
  }: { type: Transaction['tx_type']; status: Transaction['tx_status'] } & FlexProps) => {
    const Icon = getTxTypeIcon(type);

    const getStatusColor = () => {
      if (status === 'success') return color('feedback-success');
      if (status === 'pending') return color('feedback-alert');
      return color('feedback-error');
    };
    return (
      <Flex
        alignItems="center"
        justify="center"
        size="48px"
        borderRadius="8px"
        position="relative"
        display={['none', 'none', 'flex']}
        border={border()}
        bg={color('bg')}
        color={color('invert')}
        boxShadow="low"
        as="span"
        {...rest}
      >
        <Box
          bottom="0px"
          right="0px"
          position="absolute"
          bg={getStatusColor()}
          borderRadius="8px"
          size="8px"
          zIndex={9}
          as="span"
        />
        <Icon
          color={color('text-title')}
          position="relative"
          zIndex={2}
          size={type === 'token_transfer' ? '18px' : '21px'}
        />
      </Flex>
    );
  }
);

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
}

const getTitle = (transaction: Transaction) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return getContractName(transaction.smart_contract.contract_id);
    case 'contract_call':
      return getContractName(transaction.contract_call.contract_id);
    case 'token_transfer':
      return undefined;
    default:
      return truncateMiddle(transaction.tx_id, 10);
  }
};

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
    tx.tx_type === 'token_transfer'
      ? `${microToStacks(tx.token_transfer.amount)} STX`
      : (tx.tx_type === 'smart_contract' && tx?.events?.length) ||
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
    ? ([
        getTransactionTypeLabel(tx.tx_type),
        additional || date,
        additional && date,
        tx.tx_status === 'pending' ? 'Pending' : null,
      ].filter(str => str) as string[])
    : ([
        getTransactionTypeLabel(tx.tx_type),
        sentOrReceived,
        date,
        tx.tx_status === 'pending' ? 'Pending' : null,
      ].filter(str => str) as string[]);

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
  <Flex position={'relative'} zIndex={2} as="span" {...rest}>
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
      <Flex as="span" {...rest}>
        <PrincipalLink principal={tx.sender_address} />
        <Flex as="span" mx="extra-tight" color={color('invert')}>
          <ArrowRightIcon strokeWidth="1" size="14px" />
        </Flex>
        <PrincipalLink principal={tx.token_transfer.recipient_address} />
      </Flex>
    );
  }
  if (tx.tx_type === 'smart_contract' || tx.tx_type === 'contract_call') {
    return <PrincipalLink principal={tx.sender_address} />;
  }
  return null;
};

const LargeVersion = ({ tx, principal }: { tx: Transaction; principal?: string }) => {
  const title = getTitle(tx);

  return (
    <>
      <Flex display="flex" as="span" alignItems="center">
        <ItemIcon mr="base" status={tx.tx_status} type={tx.tx_type} />
        <Stack
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          as="span"
          spacing="tight"
        >
          <Details principal={principal} tx={tx} />
          <Title fontWeight="500" display="block" fontSize="16px">
            {title || truncateMiddle(tx.tx_id, 12)}
          </Title>
          <Stack
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            as="span"
            isInline
            spacing="tight"
          >
            {tx.tx_type === 'token_transfer' ? (
              <Flex as="span" alignItems="center">
                <Caption>{microToStacks(tx.token_transfer.amount)} STX</Caption>
              </Flex>
            ) : (tx.tx_type === 'smart_contract' && tx?.events?.length) ||
              (tx.tx_type === 'contract_call' && tx?.events?.length) ? (
              <Caption>{tx?.events?.length} events</Caption>
            ) : title ? (
              <Caption>{truncateMiddle(tx.tx_id)}</Caption>
            ) : null}
            <AddressArea tx={tx} />
          </Stack>
        </Stack>
      </Flex>
      <Flex as="span" justifyContent="space-between" flexDirection="column" alignItems="flex-end">
        {tx.tx_type === 'token_transfer' &&
        getMemoString(tx.token_transfer.memo)?.includes('Faucet') ? (
          <Badge
            border={border()}
            bg={color('bg')}
            labelProps={{
              display: 'flex',
              alignItems: 'center',
              color: color('text-caption'),
            }}
          >
            🚰<Box ml="tight">Faucet</Box>
          </Badge>
        ) : null}
        {tx.tx_type === 'contract_call' && (
          <Badge
            border={border()}
            bg={color('bg')}
            labelProps={{
              display: 'flex',
              alignItems: 'center',
              color: color('text-caption'),
            }}
          >
            <FunctionIcon size="16px" /> <Box>{tx.contract_call.function_name}</Box>
          </Badge>
        )}
        {tx.tx_type === 'contract_call' && (
          <Flex position="relative" zIndex="99" as="span" alignSelf="flex-end" ml="tight">
            <NextLink href={`/txid/${tx.contract_call.contract_id}`} passHref>
              <Caption as={Link}>Source contract</Caption>
            </NextLink>
          </Flex>
        )}
      </Flex>
    </>
  );
};

const MinimalVersion = ({ tx }: any) => {
  return (
    <>
      <Flex as="span" alignItems="center">
        <ItemIcon status={tx.tx_status} type={tx.tx_type} />
        <Stack spacing="extra-tight" ml="base">
          <Details minimal tx={tx} />
          <Flex>
            <Caption display="block">
              {addSepBetweenStrings([getRelativeTimestamp(tx), truncateMiddle(tx.tx_id)])}
            </Caption>
          </Flex>
        </Stack>
      </Flex>
      <Flex alignItems="flex-start">
        {tx.tx_type === 'token_transfer' &&
        getMemoString(tx.token_transfer.memo)?.includes('Faucet') ? (
          <Badge
            border={border()}
            bg={color('bg')}
            labelProps={{
              display: 'flex',
              alignItems: 'center',
              color: color('text-caption'),
            }}
          >
            🚰<Box ml="tight">Faucet</Box>
          </Badge>
        ) : null}
        {tx.tx_type === 'contract_call' && (
          <Badge
            border={border()}
            bg={color('bg')}
            labelProps={{
              display: 'flex',
              alignItems: 'center',
              color: color('text-caption'),
            }}
          >
            <FunctionIcon size="16px" /> <Box>{tx.contract_call.function_name}</Box>
          </Badge>
        )}
      </Flex>
    </>
  );
};

export const TxItem = forwardRefWithAs<TxItemProps, 'span'>(
  ({ tx, isHovered, isFocused, minimal = false, as = 'span', principal, ...rest }, ref) => {
    return (
      <Flex
        px="base"
        justifyContent="space-between"
        alignItems="stretch"
        style={{ outline: 'none' }}
        py="base"
        flexShrink={0}
        ref={ref}
        cursor={isHovered ? ['unset', 'unset', 'pointer'] : undefined}
        width="100%"
        as={as}
        {...rest}
        display="flex"
      >
        {minimal ? (
          <MinimalVersion tx={tx} />
        ) : (
          <LargeVersion principal={principal} tx={tx as any} />
        )}
      </Flex>
    );
  }
);
