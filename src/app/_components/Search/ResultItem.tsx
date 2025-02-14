import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { ArrowRight, KeyReturn } from '@phosphor-icons/react';
import * as React from 'react';
import { ReactNode } from 'react';

import {
  MempoolTenureChangeTransaction,
  MempoolTransaction,
  TenureChangeTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import {
  CoinbaseTxs,
  ContractCallTxs,
  ContractDeployTxs,
  TokenTransferTxs,
} from '../../../common/types/tx';
import {
  getContractName,
  microToStacksFormatted,
  truncateMiddle,
} from '../../../common/utils/utils';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import StxIcon from '../../../ui/icons/StxIcon';
import { SearchLink } from './SearchLink';
import { TxTag } from './TxTag';

function ResultItemWrapper({ children, ...props }: FlexProps) {
  return (
    <Flex
      background={'surfacePrimary'}
      borderRadius={'redesign.md'}
      px={3.5}
      py={3}
      alignItems={'center'}
      gap={2}
      justifyContent={'space-between'}
      _hover={{
        background: 'surfaceSecondary',
      }}
      {...props}
    >
      {children}
    </Flex>
  );
}

function ResultItemIcon({ type }: { type?: 'arrow' | 'enter' | undefined }) {
  if (type === 'enter') {
    return (
      <Flex alignItems={'center'} gap={1.5} flex={'0 0 auto'}>
        <Icon h={3.5} w={3.5} color={'iconSecondary'}>
          <KeyReturn />
        </Icon>
        <Text fontSize={'xs'} color={'textSecondary'}>
          Enter
        </Text>
      </Flex>
    );
  }
  if (type === 'arrow') {
    return (
      <Icon h={4} w={4} color={'iconSecondary'}>
        <ArrowRight />
      </Icon>
    );
  }
  return null;
}

export function ResultItem({ value }: { value: string }) {
  return (
    <ResultItemWrapper>
      <SearchLink href={'#'}>{value}</SearchLink>
      <ResultItemIcon type={'arrow'} />
    </ResultItemWrapper>
  );
}

function TxResultItem({
  tx,
  children,
}: {
  tx: Transaction | MempoolTransaction;
  children: ReactNode;
}) {
  return (
    <ResultItemWrapper>
      <Flex gap={4} flex={'1 1 auto'} minWidth={0}>
        {children}
        <TxTag
          type={
            tx.tx_status === 'pending'
              ? 'pending'
              : tx.tx_status === 'success'
                ? 'confirmed'
                : 'failed'
          }
        />
      </Flex>
      <ResultItemIcon type={'arrow'} />
    </ResultItemWrapper>
  );
}

export function TokenTransferResultItem({ tx }: { tx: TokenTransferTxs }) {
  return (
    <TxResultItem tx={tx}>
      <SearchLink href={'#'}>{microToStacksFormatted(tx.token_transfer.amount)} STX</SearchLink>
      <Flex gap={1.5} alignItems={'center'}>
        <Text fontSize={'sm'} color={'textPrimary'} whiteSpace={'nowrap'}>
          {truncateMiddle(tx.sender_address, 4)}
        </Text>
        <Icon h={4} w={4} color={'textTertiary'}>
          <ArrowRight />
        </Icon>
        <Text fontSize={'sm'} color={'textSecondary'} whiteSpace={'nowrap'}>
          {truncateMiddle(tx.token_transfer.recipient_address, 4)}
        </Text>
      </Flex>
    </TxResultItem>
  );
}

export function ContractDeployResultItem({ tx }: { tx: ContractDeployTxs }) {
  return (
    <TxResultItem tx={tx}>
      <SearchLink href={'#'}>{getContractName(tx.smart_contract.contract_id)}</SearchLink>
      <Text fontSize={'sm'} color={'textPrimary'} whiteSpace={'nowrap'}>
        {truncateMiddle(tx.tx_id, 4)}
      </Text>
    </TxResultItem>
  );
}

export function ContractCallResultItem({ tx }: { tx: ContractCallTxs }) {
  return (
    <TxResultItem tx={tx}>
      <SearchLink href={'#'}>{tx.contract_call.function_name}</SearchLink>
      <Text fontSize={'sm'} color={'textPrimary'} whiteSpace={'nowrap'}>
        {truncateMiddle(tx.tx_id, 4)}
      </Text>
    </TxResultItem>
  );
}

export function CoinbaseResultItem({ tx }: { tx: CoinbaseTxs }) {
  return (
    <TxResultItem tx={tx}>
      <SearchLink href={'#'}>Coinbase</SearchLink>
      <Text fontSize={'sm'} color={'textPrimary'} whiteSpace={'nowrap'}>
        {truncateMiddle(tx.tx_id, 4)}
      </Text>
    </TxResultItem>
  );
}

export function TenureChangeResultItem({
  tx,
}: {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}) {
  return (
    <TxResultItem tx={tx}>
      <SearchLink href={'#'}>Tenure Change</SearchLink>
      <Text fontSize={'sm'} color={'textPrimary'} whiteSpace={'nowrap'}>
        {truncateMiddle(tx.tx_id, 4)}
      </Text>
    </TxResultItem>
  );
}

export function BnsResultItem({ bns, address }: { bns: string; address: string }) {
  return (
    <ResultItemWrapper>
      <Flex gap={4} flex={'1 1 auto'} minWidth={0}>
        <SearchLink href={'#'}>{bns}</SearchLink>
        <Text fontSize={'sm'} color={'textPrimary'} whiteSpace={'nowrap'}>
          {truncateMiddle(address, 5)}
        </Text>
      </Flex>
      <ResultItemIcon type={'arrow'} />
    </ResultItemWrapper>
  );
}

export function BlockResultItem({ height, hash }: { height: number; hash: string }) {
  return (
    <ResultItemWrapper py={2.5}>
      <Flex gap={4} flex={'1 1 auto'} minWidth={0}>
        <TextLink href={'#'}>
          <Flex
            alignItems={'center'}
            gap={1.5}
            background={'surfaceTertiary'}
            px={1.5}
            py={1}
            borderRadius={'redesign.md'}
          >
            <Icon
              h={4}
              w={4}
              color={'white'}
              background={'accent.stacks-500'}
              px={1}
              borderRadius={'redesign.xs'}
            >
              <StxIcon />
            </Icon>
            <Text
              color={'textPrimary'}
              textDecoration={'underline'}
              fontSize={'sm'}
              lineHeight={'base'}
              fontFamily="var(--font-matter-mono)"
            >
              #{height}
            </Text>
          </Flex>
        </TextLink>
        <Text fontSize={'sm'} color={'textPrimary'} whiteSpace={'nowrap'}>
          {truncateMiddle(hash, 4)}
        </Text>
      </Flex>
      <ResultItemIcon type={'arrow'} />
    </ResultItemWrapper>
  );
}
