import * as React from 'react';
import { Ref } from 'react';
import {
  Box,
  Flex,
  Stack,
  CodeBlock,
  FlexProps,
  BlockstackIcon,
  BoxProps,
  ChevronIcon,
} from '@blockstack/ui';
import { startPad } from '@common/utils';
import { Text } from '@components/typography';
import {
  TransactionEvent,
  TransactionEventAssetType,
} from '@blockstack/stacks-blockchain-sidecar-types';
import { deserializeCV, addressToString } from '@blockstack/stacks-transactions';
import { Tooltip } from '@components/tooltip';
import { Caption } from '@components/typography';
import BN from 'bn.js';

import { truncateMiddle, getFungibleAssetName } from '@common/utils';

import 'prismjs/components/prism-json';

import { DefaultContract } from '@components/icons/default-contract';
import { getAssetEventTypeLabel, getEventTypeName } from '@components/token-transfer/utils';
import { TokenTransferItemProps } from '@components/token-transfer/types';
import { LogIcon } from '@components/svg';
import { useHover } from 'use-events';

const Cell = React.memo((props: FlexProps) => (
  <Flex px="tight" direction="column" justify="center" {...props} />
));

const AssetWithTooltip = React.memo(({ value, label }: any) => {
  return (
    <Tooltip placement="top" label={label}>
      <Text>{value}</Text>
    </Tooltip>
  );
});

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

export const CellItem = React.memo(
  ({
    value,
    label,
    textProps = {},
    truncate,
    ...rest
  }: {
    value?: any;
    label?: string | any;
    truncate?: boolean;
    textProps?: BoxProps;
  } & FlexProps) => {
    return value ? (
      <Cell {...rest}>
        <ValueWrapped truncate={truncate} value={value} {...textProps} />
        {label ? (
          <Box>
            <Caption>{label}</Caption>
          </Box>
        ) : null}
      </Cell>
    ) : null;
  }
);

const ItemIcon = React.memo(({ type }: { type: TransactionEvent['event_type'] }) => {
  switch (type) {
    case 'smart_contract_log':
      return (
        <Box display={['none', 'none', 'block']} color="var(--colors-invert)" mr="tight">
          <DefaultContract size="20px" />
        </Box>
      );
    default:
      return (
        <Box display={['none', 'none', 'block']} color="var(--colors-invert)" mr="tight">
          <BlockstackIcon size="20px" />
        </Box>
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
        {event.asset?.asset_id ? (
          <Text fontSize="16px" fontWeight="500" color="var(--colors-text-title)">
            {getFungibleAssetName(event.asset.asset_id)}
          </Text>
        ) : (
          <Text fontSize="16px" fontWeight="500" color="var(--colors-text-title)">
            {getEventTypeName(event.event_type)}
          </Text>
        )}
      </Flex>
    ) : null
);

const clarityValue = (value: string) => {
  const deserializeAsset = deserializeCV(Buffer.from(value.replace('0x', ''), 'hex'));

  if (deserializeAsset.type === 5 && 'address' in deserializeAsset) {
    return addressToString(deserializeAsset.address);
  }
  if (deserializeAsset.type === 1 && 'value' in deserializeAsset) {
    return (deserializeAsset.value as BN).toString();
  }
  if (deserializeAsset.type === 2 && 'buffer' in deserializeAsset) {
    return (deserializeAsset.buffer as Buffer).toString();
  }
};

const AssetEventAmount = React.memo(
  ({ event, ...rest }: { event: TransactionEvent } & BoxProps) => {
    if (event.event_type === 'smart_contract_log') {
      return (
        <Text fontWeight="500" {...rest}>
          {clarityValue(event.contract_log.value)}
        </Text>
      );
    }

    let value = event?.asset?.value;
    if (value && clarityValue(value)) {
      value = clarityValue(value);
    }
    if (event.asset?.amount || value) {
      return (
        <Text fontWeight="500" {...rest}>
          {event.asset?.amount || value}{' '}
          <AssetWithTooltip
            label={event.event_type}
            value={
              event.event_type === 'stx_asset'
                ? 'uSTX'
                : event.event_type === 'non_fungible_token_asset'
                ? 'NFT'
                : 'FT'
            }
          />
        </Text>
      );
    }
    return null;
  }
);

const AssetEventType = React.memo(({ event, ...rest }: { event: TransactionEvent } & BoxProps) => {
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
      event.asset?.asset_event_type as TransactionEventAssetType
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
});

export const TokenTransferItem = ({
  data,
  noBottomBorder,
  length = 0,
  ...flexProps
}: TokenTransferItemProps) => {
  const [isOpen, openCode] = React.useState(false);
  const [hover, bind] = useHover();
  const handleOpen = React.useCallback(() => {
    openCode(!isOpen);
  }, [isOpen]);
  return (
    <Box>
      <Stack
        isInline
        borderBottom={!isOpen && noBottomBorder ? 'unset' : '1px solid'}
        borderColor="var(--colors-border)"
        py="loose"
        pr="base"
        onClick={handleOpen}
        _hover={{
          cursor: 'pointer',
        }}
        {...bind}
        {...flexProps}
      >
        <EventAsset length={length} event={data} />
        <Stack
          align="center"
          isInline
          width="50%"
          flexShrink={0}
          flexGrow={1}
          pt={['base', 'base', 'unset']}
        >
          <AssetEventType width="50%" event={data} />
          <AssetEventAmount width="50%" event={data} />

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
      {isOpen ? (
        <Box
          bg="ink"
          borderBottom={noBottomBorder ? 'unset' : '1px solid var(--colors-border)'}
          borderBottomRightRadius={noBottomBorder ? '12px' : 'unset'}
          borderBottomLeftRadius={noBottomBorder ? '12px' : 'unset'}
        >
          <CodeBlock
            showLineNumbers
            code={JSON.stringify(data, null, '  ')}
            // @ts-ignore
            language="json"
          />
        </Box>
      ) : null}
    </Box>
  );
};
