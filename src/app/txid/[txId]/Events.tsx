'use client';

import { Code } from '@chakra-ui/react';
import React, { FC, Fragment } from 'react';
import { IconType } from 'react-icons';
import { TbAlignLeft, TbArrowRight, TbPlus, TbTrash } from 'react-icons/tb';

import {
  Transaction,
  TransactionEvent,
  TransactionEventAssetType,
} from '@stacks/stacks-blockchain-api-types';
import { deserialize, prettyPrint } from '@stacks/transactions/dist/cl';

import { Circle } from '../../../common/components/Circle';
import { AddressLink } from '../../../common/components/ExplorerLinks';
import { Section } from '../../../common/components/Section';
import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { Pending } from '../../../common/components/status';
import { useFtMetadata } from '../../../common/queries/useFtMetadata';
import { useTxEventsByIdInfinite } from '../../../common/queries/useTxEventsByIdInfinite';
import {
  addSepBetweenStrings,
  capitalize,
  ftDecimals,
  getAssetNameParts,
  microToStacksFormatted,
  truncateMiddle,
} from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { HStack } from '../../../ui/HStack';
import { Icon } from '../../../ui/Icon';
import { StxIcon } from '../../../ui/icons';
import { Caption } from '../../../ui/typography';
import { SenderRecipient } from './SenderRecipient';

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

const getIcon = (type: string) => {
  switch (type) {
    case 'burn':
      return TbTrash;
    case 'mint':
      return TbPlus;
    case 'transfer':
      return TbArrowRight;
    default:
      return null;
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

function getEventIcon(event: TransactionEvent) {
  if (event.event_type === 'smart_contract_log') return TbAlignLeft;

  if (
    event.event_type === 'fungible_token_asset' ||
    event.event_type === 'non_fungible_token_asset'
  )
    return getIcon(event.asset.asset_event_type);

  return StxIcon;
}

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
      return event.asset.amount ? `${microToStacksFormatted(event.asset.amount)} STX` : undefined;
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

function formatValue(repr: string, hex: string) {
  const value = deserialize(hex);
  const formattedString = prettyPrint(value, 2);
  return formattedString;
}

function handleContractLogHex(repr: string, hex: string) {
  if (repr?.startsWith('0x')) {
    try {
      return Buffer.from(repr.replace('0x', ''), 'hex').toString('utf8');
    } catch (e) {
      return formatValue(repr, hex);
    }
  }
  return formatValue(repr, hex);
}

const getName = (event: TransactionEvent) => {
  const assetId =
    event.event_type === 'fungible_token_asset' || event.event_type === 'non_fungible_token_asset'
      ? event.asset.asset_id
      : undefined;
  switch (event.event_type) {
    case 'stx_lock':
      return `${microToStacksFormatted(event.stx_lock_event.locked_amount)} STX`;
    case 'smart_contract_log':
      return (
        <Code
          style={{ whiteSpace: 'pre-wrap' }}
          bg={'transparent'}
          fontSize={'xs'}
          color={'secondaryText'}
        >
          {handleContractLogHex(event.contract_log.value.repr, event.contract_log.value.hex)}
        </Code>
      );
    case 'stx_asset':
      return event.asset?.value
        ? `${microToStacksFormatted(event.asset?.value)} STX`
        : 'STX transfer';
    default:
      return assetId ? getAssetNameParts(assetId).asset : undefined;
  }
};

const Item: React.FC<{ event: TransactionEvent }> = ({ event }) => {
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

  const { data: ftMetadata } = useFtMetadata(contractId, {
    enabled: !!contractId && event.event_type === 'fungible_token_asset',
  });

  return (
    <TwoColsListItem
      icon={
        <Circle size={4.5}>
          <Icon as={getEventIcon(event)} size={2.5} />
        </Circle>
      }
      leftContent={{
        title: name,
        subtitle: (
          <>
            <HStack flexWrap="wrap" alignItems="center" gap={1} divider={<Caption>∙</Caption>}>
              {assetEventType ? <Caption fontWeight={'semibold'}>{assetEventType}</Caption> : null}
              {assetAmounts && (
                <Caption>
                  {ftMetadata
                    ? ftDecimals((event as any).asset.amount, ftMetadata?.decimals || 0)
                    : assetAmounts}{' '}
                  {assetId &&
                    (ftMetadata?.symbol ||
                      getTicker(getAssetNameParts(assetId).asset).toUpperCase())}
                </Caption>
              )}
              {participants && participants}
              {tokenType && <Caption>{tokenType}</Caption>}
            </HStack>
            {memo && (
              <HStack flexWrap="nowrap" gap={1} divider={<Caption>∙</Caption>}>
                <Caption fontWeight={'semibold'}>Memo</Caption>
                <Caption textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'}>
                  {memo}
                </Caption>
              </HStack>
            )}
          </>
        ),
      }}
      rightContent={{ title: <Caption fontWeight={'semibold'}>{event.event_index}</Caption> }}
    />
  );
};

interface EventsProps {
  tx: Transaction;
}

export const Events: FC<EventsProps> = ({ tx }) => {
  const { data, ...actions } = useTxEventsByIdInfinite(tx.tx_id, {
    enabled: tx.event_count > tx.events.length,
  });

  if (tx.event_count === 0) return null;

  return (
    <Section title="Events">
      <>
        {tx.events.map((event, index) => (
          <Item key={index} event={event} />
        ))}
        {data?.pages.map(page => (
          <Fragment key={page.offset}>
            {page?.results.map((event, index) => <Item key={index} event={event} />)}
          </Fragment>
        ))}
      </>
      {(actions.isFetchingNextPage || actions.hasNextPage) && (
        <Box
          as="a"
          borderTopWidth="1px"
          px="16px"
          py="16px"
          _hover={{ color: 'textTitle', cursor: 'pointer' }}
          onClick={() => actions.hasNextPage && actions.fetchNextPage()}
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
