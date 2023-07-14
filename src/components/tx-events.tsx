'use client';

import { useFtMetadata } from '@/app/common/queries/useFtMetadata';
import { useApi } from '@/common/api/client';
import {
  addSepBetweenStrings,
  capitalize,
  ftDecimals,
  getAssetNameParts,
  microToStacks,
  truncateMiddle,
} from '@/common/utils';
import { SenderRecipient } from '@/components/addresses';
import { AddressLink } from '@/components/links';
import { Section } from '@/components/section';
import { useInfiniteTransactionEvents } from '@/features/transaction/use-infinite-transaction-events';
import { Box, Circle, Flex, Grid, Stack } from '@/ui/components';
import { StxIcon } from '@/ui/icons/StxIcon';
import { Caption } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { TbAlignLeft, TbArrowRight, TbPlus, TbTrash } from 'react-icons/tb';

import { FungibleTokenMetadata } from '@stacks/blockchain-api-client';
import {
  Transaction,
  TransactionEvent,
  TransactionEventAssetType,
} from '@stacks/stacks-blockchain-api-types';

import { ListItem } from '../app/common/components/ListItem';
import { useVerticallyStackedElementsBorderStyle } from '../app/common/styles/border';
import { Pending } from './status';

export const getTicker = (name: string) => {
  if (name.includes('-')) {
    const parts = name.split('-');
    if (parts.length >= 3) {
      return `${parts[0][0]}${parts[1][0]}${parts[2][0]}`;
    } else {
      return `${parts[0][0]}${parts[1][0]}${parts[1][1]}`;
    }
  } else {
    if (name.length >= 3) {
      return `${name[0]}${name[1]}${name[2]}`;
    }
    return name;
  }
};

const getIcon = (type: TransactionEventAssetType) => {
  switch (type) {
    case 'burn':
      return TbTrash;
    case 'mint':
      return TbPlus;
    case 'transfer':
      return TbArrowRight;
  }
};

const AssetEventTypeBubble = ({ type }: { type?: TransactionEventAssetType }) => {
  if (!type) return null;
  const Icon = getIcon(type);
  return (
    <Circle
      size="20px"
      bg={'bg'}
      borderWidth="1px"
      position="absolute"
      top={'-4px'}
      right="-2px"
      color={'accent'}
    >
      <Icon size="14px" color="currentColor" />
    </Circle>
  );
};

export const ItemIcon = React.memo(({ event }: { event: TransactionEvent }) => {
  const type = event.event_type;
  const colorMode = useColorMode().colorMode;
  const name =
    event.event_type === 'fungible_token_asset' ||
    event.event_type === 'non_fungible_token_asset' ||
    event.event_type === 'stx_asset'
      ? event.asset.asset_id
      : undefined;

  const assetEventType =
    event.event_type === 'fungible_token_asset' ||
    event.event_type === 'non_fungible_token_asset' ||
    event.event_type === 'stx_asset'
      ? event.asset.asset_event_type
      : undefined;

  switch (type) {
    case 'smart_contract_log':
      return (
        <Grid
          bg={'bg'}
          borderWidth="1px"
          color={'textBody'}
          size="48px"
          placeItems="center"
          borderRadius="12px"
          boxShadow="mid"
          flexShrink={0}
        >
          <TbAlignLeft strokeWidth="2" size="16px" />
        </Grid>
      );
    case 'fungible_token_asset':
      return name ? (
        <Circle flexShrink={0} textTransform="uppercase" size="48px" position="relative">
          {assetEventType ? (
            <AssetEventTypeBubble type={assetEventType as TransactionEventAssetType} />
          ) : null}
          {getAssetNameParts(name).asset[0]}
        </Circle>
      ) : null;

    case 'non_fungible_token_asset':
      return name ? (
        <Circle flexShrink={0} textTransform="uppercase" size="48px" position="relative">
          {assetEventType ? (
            <AssetEventTypeBubble type={assetEventType as TransactionEventAssetType} />
          ) : null}
          {getAssetNameParts(name).asset[0]}
        </Circle>
      ) : null;

    default:
      return (
        <Grid
          flexShrink={0}
          bg={`accent.${colorMode}`}
          mr="8px"
          size="48px"
          placeItems="center"
          borderRadius="48px"
        >
          <StxIcon size="22px" />
        </Grid>
      );
  }
});

const getAssetAmounts = (event: TransactionEvent) => {
  switch (event.event_type) {
    case 'fungible_token_asset':
      return parseFloat((event as any).asset.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    case 'non_fungible_token_asset':
      const value = parseInt(event.asset.value.repr.replace('u', ''));
      return isNaN(value) ? 0 : parseInt(event.asset.value.repr.replace('u', '')).toLocaleString();
    case 'stx_asset':
      return event.asset.amount ? `${microToStacks(event.asset.amount)} STX` : undefined;
  }
};

const getAssetEventType = (event: TransactionEvent) => {
  switch (event.event_type) {
    case 'smart_contract_log':
      return addSepBetweenStrings([`Contract log`, capitalize(event.contract_log.topic)]);
    case 'stx_lock':
      return 'STX lock';
    default:
      return 'asset' in event && event.asset && event.asset.asset_event_type
        ? capitalize(event.asset.asset_event_type)
        : undefined;
  }
};

const getParticipants = (event: TransactionEvent) => {
  if (
    event.event_type === 'stx_asset' ||
    event.event_type === 'fungible_token_asset' ||
    event.event_type === 'non_fungible_token_asset'
  )
    if ('asset' in event && event.asset) {
      switch (event.asset.asset_event_type) {
        case 'transfer': {
          return (
            <SenderRecipient
              sender={event.asset.sender as string}
              recipient={event.asset.recipient as string}
            />
          );
        }
        case 'mint':
          return event.asset.recipient ? (
            <Caption>
              <AddressLink principal={event.asset.recipient}>
                {truncateMiddle(event.asset.recipient)}
              </AddressLink>
            </Caption>
          ) : null;
      }
    }
  if (event.event_type === 'stx_lock') {
    return (
      <Caption>
        <AddressLink principal={event.stx_lock_event.locked_address}>
          {truncateMiddle(event.stx_lock_event.locked_address)}
        </AddressLink>
      </Caption>
    );
  }

  return null;
};

/**
 * FUNCTION TO CLEAN THE OUTPUT 
 * 
 * Takes the clean repr and output a json like object
 * */
type ParsedObject = { [key: string]: string | ParsedObject };

function parseInput(input: string): ParsedObject {
    const stack: any[] = [{}];
    let currentKey = '';
    let i = 0;

    while (i < input.length) {
        const char = input[i];
        if (char === '(') {
            if (currentKey) {
                const newObj = {};
                stack[stack.length - 1][currentKey] = newObj;
                stack.push(newObj);
                currentKey = '';
            }
        } else if (char === ')') {
            stack.pop();
        } else if (char === ' ' && currentKey) {
            if (input[i + 1] !== '(') {
                let value = '';
                while (input[++i] !== ' ' && input[i] !== ')') {
                    value += input[i];
                }
                stack[stack.length - 1][currentKey] = value;
                currentKey = '';
            }
        } else if (char !== ' ') {
            currentKey += char;
        }
        i++;
    }
    return stack[0];
}


function cleanString(str: string): any {
  // Remove '(tuple' from start and ')' from end
  
  const cleanString = parseInput(str);
  console.log(cleanString);
  return cleanString;
}

function reprToJson(repr: string) {
  const parsed = cleanString(repr);
  return JSON.stringify(parsed, null, 2).replace(/\\"/g, '"');
}

// handle if the print is a hex, convert it to string if so
function handleContractLogHex(repr: string) {
  if (repr?.startsWith('0x')) {
    try {
      return Buffer.from(repr.replace('0x', ''), 'hex').toString('utf8');
    } catch (e) {
      return reprToJson(repr);
    }
  }
  
  return reprToJson(repr);
}

const getName = (event: TransactionEvent) => {
  const assetId =
    event.event_type === 'fungible_token_asset' || event.event_type === 'non_fungible_token_asset'
      ? event.asset.asset_id
      : undefined;
  switch (event.event_type) {
    case 'stx_lock':
      return `${microToStacks(event.stx_lock_event.locked_amount)} STX`;
    case 'smart_contract_log':
      return <>{event.contract_log.value.repr}<br /><pre>{handleContractLogHex(event.contract_log.value.repr)}</pre></>
    case 'stx_asset':
      return event.asset?.value ? `${microToStacks(event.asset?.value)} STX` : 'STX transfer';
    default:
      return assetId ? getAssetNameParts(assetId).asset : undefined;
  }
};

const Item: React.FC<{ event: TransactionEvent }> = ({ event }) => {
  const api = useApi();
  const name = getName(event);
  const assetEventType = getAssetEventType(event);
  const assetAmounts = getAssetAmounts(event);
  const participants = getParticipants(event);

  const assetId =
    event.event_type === 'fungible_token_asset' || event.event_type === 'non_fungible_token_asset'
      ? event.asset.asset_id
      : undefined;
  const contractId = assetId?.split('::')[0] || '';

  const tokenType =
    event.event_type === 'fungible_token_asset'
      ? 'Fungible token'
      : event.event_type === 'non_fungible_token_asset'
      ? 'Non-fungible token'
      : undefined;

  const memo = event.event_type === 'stx_asset' ? event.asset.memo || '' : '';

  const { data: ftMetadata } = useFtMetadata(
    api,
    { contractId },
    { enabled: !!contractId && event.event_type === 'fungible_token_asset' }
  );

  return (
    <ListItem
      icon={<ItemIcon event={event} />}
      title={name}
      subTitle={
        <>
          <Stack
            flexWrap="wrap"
            alignItems="center"
            gap="4px"
            isInline
            divider={<Caption>∙</Caption>}
          >
            {assetEventType ? <Caption fontWeight="bold">{assetEventType}</Caption> : null}
            {assetAmounts && (
              <Caption>
                {ftMetadata
                  ? ftDecimals((event as any).asset.amount, ftMetadata?.decimals || 0)
                  : assetAmounts}{' '}
                {assetId &&
                  (ftMetadata?.symbol || getTicker(getAssetNameParts(assetId).asset).toUpperCase())}
              </Caption>
            )}
            {participants && participants}
            {tokenType && <Caption>{tokenType}</Caption>}
          </Stack>
          {memo && (
            <Stack flexWrap="nowrap" spacing="4px" isInline divider={<Caption>∙</Caption>}>
              <Caption fontWeight="bold">Memo</Caption>
              <Caption wordBreak={'break-all'}>{memo}</Caption>
            </Stack>
          )}
        </>
      }
      rightItem={event.event_index}
    />
  );
};

interface EventsProps {
  tx: Transaction;
}

export const Events: FC<EventsProps> = ({ tx }) => {
  const { data, ...actions } = useInfiniteTransactionEvents(tx.tx_id, tx.event_count, tx.events);
  if (tx.event_count === 0) return null;

  return (
    <Section title="Events">
      <Box px="24px" css={useVerticallyStackedElementsBorderStyle}>
        {tx.events.map((event, index) => (
          <Item key={index} event={event} />
        ))}
        {data?.pages.map(page => (
          <Fragment key={page.offset}>
            {page?.results.map((event, index) => (
              <Item key={index} event={event} />
            ))}
          </Fragment>
        ))}
      </Box>
      {(actions.isFetchingNextPage || actions.hasNextPage) && (
        <Box
          as="a"
          borderTopWidth="1px"
          px="16px"
          py="16px"
          _hover={{ color: 'textTitle', cursor: 'pointer' }}
          onClick={() => actions.hasNextPage && actions.fetchNextPage()}
          color={'textCaption'}
        >
          {actions.isFetchingNextPage ? (
            <Flex alignItems="center" justifyContent="center">
              <Box size="16px" as={Pending} mr="4px" />
              Loading...
            </Flex>
          ) : actions.hasNextPage ? (
            <Flex alignItems="center" justifyContent="center">
              <Caption color="currentColor">Load more events</Caption>
            </Flex>
          ) : null}
        </Box>
      )}
    </Section>
  );
};
