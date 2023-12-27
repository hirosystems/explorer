'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { HiOutlineArrowSmRight } from 'react-icons/hi';
import { PiArrowRightLight } from 'react-icons/pi';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { BoxProps } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
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
          <HStack flexWrap="wrap">
            <Caption display={['none', 'none', 'none', 'block']}>Sent to</Caption>
            <PrincipalLink principal={tx.token_transfer.recipient_address} />
          </HStack>
        );
      } else if (tx.token_transfer.recipient_address === principal) {
        return (
          <HStack flexWrap="wrap">
            <Caption display={['none', 'none', 'none', 'block']}>Received from</Caption>
            <PrincipalLink principal={tx.sender_address} />
          </HStack>
        );
      }
      return (
        <HStack flexWrap="wrap">
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
    if (tx.tx_type === 'tenure_change') {
      return <Caption>Cause: {tx.tenure_change_payload?.cause}</Caption>;
    }
    return null;
  }
);

export const TxTimestamp: React.FC<BoxProps & { tx: Transaction | MempoolTransaction }> =
  React.memo(props => {
    const { tx } = props;
    const date = getRelativeTimestamp(tx);

    return <>{date}</>;
  });

export const Nonce: React.FC<{ nonce: number }> = React.memo(({ nonce }) => (
  <Tooltip label="Nonce">
    <Caption as="span">{nonce.toString() + 'n'}</Caption>
  </Tooltip>
));
