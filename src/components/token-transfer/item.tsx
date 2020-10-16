import * as React from 'react';
import { Ref } from 'react';
import {
  Box,
  Flex,
  Stack,
  FlexProps,
  BlockstackIcon,
  BoxProps,
  ChevronIcon,
  Grid,
} from '@stacks/ui';
import { Truncate } from '@components/truncated';
import { microToStacks, startPad, validateStacksAddress } from '@common/utils';
import { Text } from '@components/typography';
import {
  TransactionEvent,
  TransactionEventAssetType,
  TransactionEventSmartContractLog,
  TransactionEventNonFungibleAsset,
  TransactionEventFungibleAsset,
  TransactionEventStxAsset,
} from '@blockstack/stacks-blockchain-api-types';
import { clarityValuetoHumanReadable } from '@common/utils';
import { Tooltip } from '@components/tooltip';
import { Caption } from '@components/typography';

import { truncateMiddle, getFungibleAssetName } from '@common/utils';
import { CodeAccordian } from '@components/code-accordian';

import { DefaultContract } from '@components/icons/default-contract';
import { getAssetEventTypeLabel, getEventTypeName } from '@components/token-transfer/utils';
import { TokenTransferItemProps } from '@components/token-transfer/types';
import { LogIcon } from '@components/svg';
import { useActive, useHover } from 'use-events';
import { color } from '@components/color-modes';
import { StxNexus } from '@components/icons/stx-nexus';
import { FungibleTokenIcon } from '@components/icons/fungible-token';
import { NonFungibleTokenIcon } from '@components/icons/non-fungible-token';
import { CodeIcon } from '@components/icons/code';

const Value = React.memo(
  React.forwardRef(({ children, ...rest }: any, ref: Ref<HTMLDivElement>) => (
    <Box>
      <Text style={{ whiteSpace: 'nowrap' }} ref={ref} {...rest} color="var(--colors-text-body)">
        {children}
      </Text>
    </Box>
  ))
);

export const ValueWrapped = React.memo(({ truncate, offset = 4, value, ...rest }: any) =>
  truncate ? (
    <Tooltip label={value}>
      <Value {...rest}>{truncateMiddle(value, offset)}</Value>
    </Tooltip>
  ) : (
    <Value {...rest}>{value}</Value>
  )
);

export const ItemIcon = React.memo(({ type }: { type: TransactionEvent['event_type'] }) => {
  switch (type) {
    case 'smart_contract_log':
      return (
        <Grid
          display={['none', 'none', 'grid']}
          bg={color('invert')}
          color={color('bg')}
          mr="tight"
          size="28px"
          placeItems="center"
          borderRadius="28px"
        >
          <CodeIcon strokeWidth="2" size="16px" />
        </Grid>
      );
    case 'fungible_token_asset':
      return (
        <Grid
          display={['none', 'none', 'grid']}
          bg={color('invert')}
          mr="tight"
          size="28px"
          placeItems="center"
          borderRadius="28px"
        >
          <Text fontSize="10px" color={color('bg')} fontWeight="800">
            FT
          </Text>
        </Grid>
      );

    case 'non_fungible_token_asset':
      return (
        <Grid
          display={['none', 'none', 'grid']}
          bg={color('invert')}
          color={color('bg')}
          mr="tight"
          size="28px"
          placeItems="center"
          borderRadius="28px"
        >
          <Text letterSpacing="-0.05em" fontSize="10px" color={color('bg')} fontWeight="800">
            NFT
          </Text>
        </Grid>
      );

    default:
      return (
        <Grid
          display={['none', 'none', 'grid']}
          bg={color('invert')}
          color={color('bg')}
          mr="tight"
          size="28px"
          placeItems="center"
          borderRadius="28px"
        >
          <StxNexus color="currentColor" size="14px" />
        </Grid>
      );
  }
});

const EventAsset = React.memo(
  ({ event, length = 0, ...rest }: { event: TransactionEvent; length?: number } & FlexProps) =>
    event ? (
      <Flex
        pl={['base', 'base', 'unset']}
        align="center"
        pr="base"
        width={'33.333%'}
        flexShrink={0}
        {...rest}
      >
        <Flex
          display={['none', 'none', 'flex']}
          align="center"
          justifyContent="center"
          width="48px"
        >
          <Caption fontSize="14px">
            {startPad(event.event_index + 1, length?.toString().length + 1)}
          </Caption>
        </Flex>
        <ItemIcon type={event.event_type} />
        {event.event_type !== 'smart_contract_log' && event.asset.asset_id ? (
          <Text fontSize="14px" fontWeight="500" color="var(--colors-text-title)">
            {getFungibleAssetName(event.asset.asset_id)}
          </Text>
        ) : (
          <Text fontSize="14px" fontWeight="500" color="var(--colors-text-title)">
            {getEventTypeName(event.event_type)}
          </Text>
        )}
      </Flex>
    ) : null
);

const ContractLogItem = React.memo(
  ({ event, ...rest }: { event: TransactionEventSmartContractLog }) => {
    const value = clarityValuetoHumanReadable(event.contract_log.value);
    const isAddress = value && validateStacksAddress(value);
    return (
      <Text style={{ wordBreak: 'break-word' }} fontWeight="500" {...rest}>
        {isAddress ? <Truncate>{value}</Truncate> : value}
      </Text>
    );
  }
);

const NonFungibleItem = React.memo(
  ({ event, ...rest }: { event: TransactionEventNonFungibleAsset }) => {
    const value = clarityValuetoHumanReadable(event.asset.value);
    return (
      <Box {...rest}>
        <Text fontWeight="500">
          {value} <Text>NFT</Text>
        </Text>
      </Box>
    );
  }
);
const FungibleItem = React.memo(({ event, ...rest }: { event: TransactionEventFungibleAsset }) => (
  <Box {...rest}>
    <Text fontWeight="500">
      {event.asset.amount} <Text>FT</Text>
    </Text>
  </Box>
));

const StxAsset = React.memo(({ event, ...rest }: { event: TransactionEventStxAsset }) => {
  if (!event.asset.amount) return null;
  return (
    <Box {...rest}>
      <Text>{microToStacks(event.asset.amount)} STX</Text>
    </Box>
  );
});

export const EventAssetValue = React.memo(
  ({ event, ...rest }: { event: TransactionEvent } & BoxProps) => {
    if (!event) return null;
    switch (event.event_type) {
      case 'fungible_token_asset':
        return <FungibleItem event={event} {...rest} />;
      case 'non_fungible_token_asset':
        return <NonFungibleItem event={event} {...rest} />;
      case 'smart_contract_log':
        return <ContractLogItem event={event} {...rest} />;
      case 'stx_asset':
        return <StxAsset event={event} {...rest} />;
    }
  }
);

export const EventAssetType = React.memo(
  ({ event, ...rest }: { event: TransactionEvent } & FlexProps) => {
    if (event.event_type === 'smart_contract_log') {
      return (
        <Flex align="center" {...rest}>
          <Box mr="tight" color="var(--colors-invert)" size="20px">
            <LogIcon />
          </Box>
          <Text fontWeight="500">Log</Text>
        </Flex>
      );
    }
    if (event.asset.asset_event_type) {
      const { label, icon: Icon } = getAssetEventTypeLabel(
        event.asset.asset_event_type as TransactionEventAssetType
      );
      return (
        <Flex align="center" {...rest}>
          {Icon && (
            <Box mr="tight">
              <Icon size="20px" />
            </Box>
          )}
          <Text fontWeight="500">{label}</Text>
        </Flex>
      );
    }
    return null;
  }
);

export const TokenTransferItem = React.memo(
  ({ data, noBottomBorder, length = 0, ...flexProps }: TokenTransferItemProps) => {
    const [isOpen, openCode] = React.useState(false);
    const [hover, bind] = useHover();
    const [active, activeBind] = useActive();
    const handleOpen = React.useCallback(() => {
      openCode(!isOpen);
    }, [isOpen]);
    return (
      <Box
        bg={active ? color('bg-light') : hover ? color('bg-alt') : 'transparent'}
        fontSize="14px"
        onClick={handleOpen as any}
        {...activeBind}
      >
        <Stack
          isInline
          borderBottom={noBottomBorder ? 'unset' : '1px solid'}
          borderColor="var(--colors-border)"
          py="loose"
          pr="base"
          _hover={{
            cursor: 'pointer',
          }}
          {...bind}
          {...flexProps}
        >
          <EventAsset length={length} event={data} />
          <Stack align="center" isInline width="50%" flexShrink={0} flexGrow={1}>
            <EventAssetType width="50%" event={data} />
            <EventAssetValue width="50%" event={data} />
            <Flex
              align="center"
              justify="center"
              width="48px"
              flexShrink={0}
              color="var(--colors-invert)"
              opacity={hover ? 1 : 0.5}
            >
              <ChevronIcon size="32px" direction={isOpen ? 'up' : 'down'} />
            </Flex>
          </Stack>
        </Stack>
        <CodeAccordian
          borderTop={noBottomBorder ? '1px solid var(--colors-border)' : 'unset'}
          borderBottom={isOpen && !noBottomBorder ? '1px solid' : 'unset'}
          isLast={noBottomBorder}
          code={data}
          isOpen={isOpen}
        />
      </Box>
    );
  }
);
