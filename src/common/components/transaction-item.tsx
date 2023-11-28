'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { HiOutlineArrowSmRight } from 'react-icons/hi';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { BoxProps } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Stack } from '../../ui/Stack';
import { Tooltip } from '../../ui/Tooltip';
import { Caption, Text } from '../../ui/typography';
import { toRelativeTime, truncateMiddle } from '../utils/utils';
import { ExplorerLink } from './ExplorerLinks';

export interface TxItemProps extends FlexProps {
  tx: Transaction | MempoolTransaction;
  minimal?: boolean;
  isFocused?: boolean;
  target?: string;
  principal?: string;
  onClick?: any;
  onFocus?: any;
  onBlur?: any;
  tabIndex?: any;
  hideIcon?: boolean;
  hideRightElements?: boolean;
}

const getRelativeTimestamp = (tx: Transaction | MempoolTransaction) => {
  const date =
    typeof (tx as any).burn_block_time !== 'undefined' && (tx as any).burn_block_time !== -1
      ? toRelativeTime((tx as any).burn_block_time * 1000)
      : (tx as any).burn_block_time === -1
        ? toRelativeTime((tx as any).parent_burn_block_time * 1000)
        : (tx as any).receipt_time
          ? toRelativeTime((tx as any).receipt_time * 1000)
          : 'Pending...';

  return date;
};

export const PrincipalLink: React.FC<FlexProps & { principal: string }> = ({
  principal,
  ...rest
}) => (
  <Flex display="inline-flex" position={'relative'} as="span" {...rest}>
    <ExplorerLink href={`/address/${encodeURIComponent(principal)}`}>
      <Caption
        as={'a'}
        color={`links.${useColorMode().colorMode}`}
        _hover={{
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        textDecoration="none"
      >
        {truncateMiddle(principal)}
      </Caption>
    </ExplorerLink>
  </Flex>
);

export const AddressArea = React.memo(
  ({
    tx,
    principal,
    ...rest
  }: { tx: Transaction | MempoolTransaction; principal?: string } & FlexProps) => {
    if (tx.tx_type === 'token_transfer') {
      if (tx.sender_address === principal) {
        return (
          <Stack flexWrap="wrap" isInline {...({ as: 'span', ...rest } as any)}>
            <Caption display={['none', 'none', 'none', 'block']}>Sent to</Caption>
            <PrincipalLink principal={tx.token_transfer.recipient_address} />
          </Stack>
        );
      } else if (tx.token_transfer.recipient_address === principal) {
        return (
          <Stack flexWrap="wrap" isInline {...({ as: 'span', ...rest } as any)}>
            <Caption display={['none', 'none', 'none', 'block']}>Received from</Caption>
            <PrincipalLink principal={tx.sender_address} />
          </Stack>
        );
      }
      return (
        <Stack flexWrap="wrap" isInline {...({ as: 'span', ...rest } as any)}>
          <PrincipalLink principal={tx.sender_address} />
          <Flex as="span" color={'textCaption'}>
            <Icon as={HiOutlineArrowSmRight} strokeWidth="1.5" size="15px" />
          </Flex>
          <PrincipalLink principal={tx.token_transfer.recipient_address} />
        </Stack>
      );
    }
    if (tx.tx_type === 'contract_call') {
      return (
        <Caption>
          By <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    if (tx.tx_type === 'smart_contract') {
      return (
        <Caption>
          By <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    if (tx.tx_type === 'coinbase') {
      return (
        <Caption>
          Mined by <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    return null;
  }
);

export const TxTimestamp: React.FC<BoxProps & { tx: Transaction | MempoolTransaction }> =
  React.memo(props => {
    const { tx } = props;
    const date = getRelativeTimestamp(tx);

    return (
      <Text fontSize="14px" textAlign="right" color={'textBody'} suppressHydrationWarning>
        {date}
      </Text>
    );
  });

export const Nonce: React.FC<{ nonce: number }> = React.memo(({ nonce }) => (
  <>
    {'·'}
    <Tooltip label="Nonce">
      <Caption as="span" text-align="right" ml="6px">
        {nonce.toString() + 'n'}
      </Caption>
    </Tooltip>
  </>
));
