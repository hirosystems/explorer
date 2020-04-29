import * as React from 'react';
import { Box, Flex, Grid, FlexProps, Text, BlockstackIcon } from '@blockstack/ui';
import { TransactionEvent } from '@blockstack/stacks-blockchain-sidecar-types';
import { deserializeCV, addressToString } from '@blockstack/stacks-transactions';

import { Caption } from '@components/typography';

import {
  truncateMiddle,
  microToStacks,
  getContractName,
  getFungibleAssetName,
} from '@common/utils';

import { DefaultContract } from '@components/icons/default-contract';
import { getAssetEventTypeLabel, getEventTypeName } from '@components/token-transfer/utils';
import { TokenTransferItemProps } from '@components/token-transfer/types';

const Cell = (props: FlexProps) => (
  <Flex px="tight" direction="column" justify="center" {...props} />
);

const CellItem = ({ value, label }: { value?: string; label?: string }) =>
  value ? (
    <Cell>
      <Box>
        <Text color="var(--colors-text-body)">{value}</Text>
      </Box>
      {label ? (
        <Box>
          <Caption>{label}</Caption>
        </Box>
      ) : null}
    </Cell>
  ) : null;

const ItemIcon = ({ type }: { type: TransactionEvent['event_type'] }) => {
  switch (type) {
    case 'smart_contract_log':
      return (
        <Box color="var(--colors-invert)" mr="base">
          <DefaultContract size="24px" />
        </Box>
      );
    default:
      return (
        <Box color="var(--colors-invert)" mr="tight">
          <BlockstackIcon size="24px" />
        </Box>
      );
  }
};

const ContractLogCellItem = ({ event }: { event: TransactionEvent }) => {
  if (event.contract_log) {
    let value = event.contract_log.value;

    const deserializeAsset = deserializeCV(
      Buffer.from(event.contract_log.value.replace('0x', ''), 'hex')
    );

    if (deserializeAsset.type === 5 && 'address' in deserializeAsset) {
      value = addressToString(deserializeAsset.address);
    }
    return <CellItem value={value} label={event.contract_log.topic} />;
  }
  return null;
};

const EventAsset = ({ event, ...rest }: { event: TransactionEvent } & FlexProps) =>
  event ? (
    <Flex align="center" pr="base" width={['100%', '100%', '25%']} {...rest}>
      <ItemIcon type={event.event_type} />
      {event.asset?.asset_id ? (
        <CellItem
          value={getFungibleAssetName(event.asset.asset_id)}
          label={getContractName(event.asset.asset_id).split('::')[0]}
        />
      ) : (
        <Text color="var(--colors-text-title)">{getEventTypeName(event.event_type)}</Text>
      )}
    </Flex>
  ) : null;

const StxAmount = ({ event, ...rest }: { event: TransactionEvent }) =>
  event.asset ? (
    <CellItem
      value={`${microToStacks(event?.asset.amount as string)} STX`}
      label={getAssetEventTypeLabel(event.asset?.asset_event_type)}
      {...rest}
    />
  ) : null;

const Sender = ({ event, ...rest }: { event: TransactionEvent }) =>
  event.asset?.sender ? (
    <CellItem value={truncateMiddle(event.asset?.sender as string)} label="From" {...rest} />
  ) : null;

const Recipient = ({ event, ...rest }: { event: TransactionEvent }) =>
  event.asset?.recipient ? (
    <CellItem value={truncateMiddle(event.asset?.recipient as string)} label="From" {...rest} />
  ) : null;

export const TokenTransferItem = ({
  data,
  noBottomBorder,
  ...flexProps
}: TokenTransferItemProps) => (
  <Flex
    flexWrap="wrap"
    borderBottom={noBottomBorder ? 'unset' : '1px solid'}
    borderColor="var(--colors-border)"
    px="base-loose"
    py="loose"
    {...flexProps}
  >
    <EventAsset event={data} />
    <Grid
      width={['100%', '100%', '75%']}
      gridTemplateColumns="repeat(3,1fr)"
      flexGrow={1}
      pt={['base', 'base', 'unset']}
    >
      <StxAmount event={data} />
      <Sender event={data} />
      <Recipient event={data} />
      <ContractLogCellItem event={data} />
    </Grid>
  </Flex>
);
