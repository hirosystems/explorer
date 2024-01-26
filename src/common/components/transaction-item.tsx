'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { PiArrowRightLight } from 'react-icons/pi';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { BoxProps } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Icon } from '../../ui/Icon';
import { Tooltip } from '../../ui/Tooltip';
import { Caption } from '../../ui/typography';
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

const getTransactionTime = (tx: Transaction | MempoolTransaction) => {
  if (typeof (tx as any).burn_block_time !== 'undefined' && (tx as any).burn_block_time !== -1) {
    return (tx as any).burn_block_time;
  } else if ((tx as any).burn_block_time === -1) {
    return (tx as any).parent_burn_block_time;
  } else if ((tx as any).receipt_time) {
    return (tx as any).receipt_time;
  }
  return null;
};

const getRelativeTimestamp = (tx: Transaction | MempoolTransaction) => {
  const txTime = getTransactionTime(tx);
  const date = txTime ? toRelativeTime(txTime * 1000) : 'Pending...';
  return date;
};

export const PrincipalLink: React.FC<FlexProps & { principal: string }> = ({
  principal,
  ...rest
}) => (
  <Flex display="inline-flex" position={'relative'} as="span" {...rest}>
    <ExplorerLink href={`/address/${encodeURIComponent(principal)}`}>
      <Caption
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
  ({ tx, principal }: { tx: Transaction | MempoolTransaction; principal?: string } & FlexProps) => {
    if (tx.tx_type === 'token_transfer') {
      if (tx.sender_address === principal) {
        return (
          <HStack flexWrap="nowrap" whiteSpace="nowrap">
            <Caption display={['none', 'none', 'none', 'block']}>Sent to</Caption>
            <PrincipalLink principal={tx.token_transfer.recipient_address} />
          </HStack>
        );
      } else if (tx.token_transfer.recipient_address === principal) {
        return (
          <HStack flexWrap="nowrap" whiteSpace="nowrap">
            <Caption display={['none', 'none', 'none', 'block']}>Received from</Caption>
            <PrincipalLink principal={tx.sender_address} />
          </HStack>
        );
      }
      return (
        <HStack flexWrap="nowrap" whiteSpace="nowrap">
          <PrincipalLink principal={tx.sender_address} />
          <Flex as="span">
            <Icon as={PiArrowRightLight} size={3} />
          </Flex>
          <PrincipalLink principal={tx.token_transfer.recipient_address} />
        </HStack>
      );
    }
    if (tx.tx_type === 'contract_call') {
      return (
        <Caption whiteSpace="nowrap">
          By <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    if (tx.tx_type === 'smart_contract') {
      return (
        <Caption whiteSpace="nowrap">
          By <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    if (tx.tx_type === 'coinbase') {
      return (
        <Caption whiteSpace="nowrap">
          Mined by <PrincipalLink principal={tx.sender_address} />
        </Caption>
      );
    }
    if (tx.tx_type === 'tenure_change') {
      return <Caption whiteSpace="nowrap">Cause: {tx.tenure_change_payload?.cause}</Caption>;
    }
    return null;
  }
);

export const TxTimestamp: React.FC<BoxProps & { tx: Transaction | MempoolTransaction }> =
  React.memo(props => {
    const { tx } = props;
    const relativeTimestamp = getRelativeTimestamp(tx);
    const txTime = getTransactionTime(tx);
    const date = new Date(txTime * 1000);
    const dateString = date.toUTCString();

    return <Tooltip label={dateString}>{relativeTimestamp}</Tooltip>;
  });

export const Nonce: React.FC<{ nonce: number }> = React.memo(({ nonce }) => (
  <Caption as="span">Nonce: {nonce.toString()}</Caption>
));
