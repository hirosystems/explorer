import * as React from 'react';
import {
  Box,
  Flex,
  Grid,
  ChevronIcon,
  FlexProps,
  Text,
  BlockstackIcon,
  BoxProps,
} from '@blockstack/ui';
import { Card } from '@components/card';
import { Caption, SectionTitle } from '@components/typography';
import { useHover } from 'use-events';
import {
  TokenTransferTransaction,
  SmartContractTransaction,
} from '@blockstack/stacks-blockchain-sidecar-types';
import {
  truncateMiddle,
  microToStacks,
  getContractName,
  getFungibleAssetName,
} from '@common/utils';
import { DefaultContract } from '@components/icons/default-contract';
import { deserializeCV, addressToString } from '@blockstack/stacks-transactions';

interface BottomButtonProps extends FlexProps {
  label: string;
  icon: React.FC;
}
const BottomButton: React.FC<BottomButtonProps> = ({ label, icon: Icon, ...props }) => {
  const [hover, bind] = useHover();
  return (
    <Flex
      borderBottomLeftRadius="12px"
      borderBottomRightRadius="12px"
      py="base"
      align="center"
      justify={['center', 'center', 'unset']}
      px="base-loose"
      cursor={hover ? 'pointer' : 'unset'}
      bg={hover ? 'ink.50' : 'transparent'}
      style={{
        userSelect: 'none',
      }}
      {...props}
      {...bind}
    >
      {Icon && (
        <Box color={hover ? 'ink.600' : 'ink.400'}>
          <Icon />
        </Box>
      )}
      <Text textStyle="body.small">{label}</Text>
    </Flex>
  );
};

const Cell = (props: FlexProps) => {
  return <Flex px="tight" direction="column" justify="center" {...props} />;
};

const CellItem = ({ value, label }: { value?: string; label?: string }) => {
  return value ? (
    <Cell>
      <Box>
        <Text>{value}</Text>
      </Box>
      {label ? (
        <Box>
          <Caption>{label}</Caption>
        </Box>
      ) : null}
    </Cell>
  ) : null;
};
interface AssetType {
  asset_event_type?: 'transfer' | 'mint' | 'burn';
  asset_id?: string;
  sender?: string;
  recipient?: string;
  amount?: string;
  value?: string;
}
interface EventSingle {
  event_index: number;
  event_type:
    | 'smart_contract_log'
    | 'stx_asset'
    | 'fungible_token_asset'
    | 'non_fungible_token_asset';
  asset?: AssetType;
  contract_log?: {
    contract_id: string;
    topic: string;
    value: string;
  };
}
interface TokenTransferItemProps extends FlexProps {
  data: EventSingle;
  noBottomBorder?: boolean;
}

const renderName = (value: EventSingle['event_type']) => {
  switch (value) {
    case 'stx_asset':
      return 'Stacks Token';
    case 'smart_contract_log':
      return 'Smart Contract';
    case 'fungible_token_asset':
      return 'Fungible Asset';
    case 'non_fungible_token_asset':
      return 'Non-fungible Asset';
  }
};
const renderLabel = (value: AssetType['asset_event_type']) => {
  switch (value) {
    case 'transfer':
      return 'Transferred';
    case 'mint':
      return 'Minted';
    case 'burn':
      return 'Burned';
  }
};

const ItemIcon = ({ type }: { type: EventSingle['event_type'] }) => {
  switch (type) {
    case 'smart_contract_log':
      return (
        <Box mr="tight">
          <DefaultContract size="24px" />
        </Box>
      );
    default:
      return (
        <Box color="blue" mr="tight">
          <BlockstackIcon size="24px" />
        </Box>
      );
  }
};
interface EventShape {
  event_index: number;
  event_type:
    | 'smart_contract_log'
    | 'stx_asset'
    | 'fungible_token_asset'
    | 'non_fungible_token_asset';
  asset?: {
    asset_event_type?: 'transfer' | 'mint' | 'burn';
    asset_id?: string;
    sender?: string;
    recipient?: string;
    amount?: string;
    value?: string;
  };
  contract_log?: {
    contract_id: string;
    topic: string;
    value: string;
  };
}
const ContractLogCellItem = ({ event }: { event: EventShape }) => {
  if (event.contract_log) {
    let value = event.contract_log.value;
    const thing = deserializeCV(Buffer.from(event.contract_log.value.replace('0x', ''), 'hex'));

    if (thing.type === 5 && 'address' in thing) {
      value = addressToString(thing.address);
    }
    return <CellItem value={value} label={event.contract_log.topic} />;
  }
  return null;
};

const TokenTransferItem = ({ data, noBottomBorder, ...flexProps }: TokenTransferItemProps) => (
  <Flex
    flexWrap="wrap"
    borderBottom={noBottomBorder ? 'unset' : '1px solid'}
    borderColor="inherit"
    px="base-loose"
    py="loose"
    {...flexProps}
  >
    <Flex align="center" pr="base" width={['100%', '100%', '25%']}>
      <ItemIcon type={data.event_type} />
      {data.asset?.asset_id ? (
        <CellItem
          value={getFungibleAssetName(data.asset.asset_id)}
          label={getContractName(data.asset.asset_id).split('::')[0]}
        />
      ) : (
        <Text>{renderName(data.event_type)}</Text>
      )}
    </Flex>
    <Grid
      width={['100%', '100%', '75%']}
      gridTemplateColumns="repeat(3,1fr)"
      flexGrow={1}
      pt={['base', 'base', 'unset']}
    >
      {data.asset?.amount ? (
        <CellItem
          value={`${microToStacks(data.asset.amount)} STX`}
          label={renderLabel(data.asset?.asset_event_type)}
        />
      ) : null}
      {data.asset?.sender ? (
        <CellItem value={truncateMiddle(data.asset?.sender)} label="From" />
      ) : null}
      {data.asset?.recipient ? (
        <CellItem value={truncateMiddle(data.asset?.recipient)} label="To" />
      ) : null}
      <ContractLogCellItem event={data} />
    </Grid>
  </Flex>
);

interface TokenTransferProps extends BoxProps {
  events?: TokenTransferTransaction['events'];
}

/**
 * TODO: account for if there are many events. Limit to 5, show button if more, render more if button clicked
 */
export const TokenTransfers = ({ events, ...boxProps }: TokenTransferProps) => {
  const limit = 5;
  const sortedEvents =
    events && events.length
      ? events.slice().sort((a: EventSingle, b: EventSingle) => {
          return a.event_index - b.event_index;
        })
      : [];
  return sortedEvents?.length ? (
    <Box mt="extra-loose" {...boxProps}>
      <SectionTitle mb="base-loose">Token transfers</SectionTitle>
      <Card>
        {sortedEvents.map((event: EventSingle, key) =>
          event ? (
            <TokenTransferItem
              noBottomBorder={
                sortedEvents?.length - 1 > limit
                  ? false
                  : (key === limit - 1 && sortedEvents?.length - 1 > limit) ||
                    key === sortedEvents?.length - 1
              }
              data={event}
              key={key}
            />
          ) : null
        )}
        {sortedEvents.length - 1 > limit ? (
          <BottomButton
            icon={() => <ChevronIcon direction="down" size={6} color="currentColor" />}
            label={`${sortedEvents.length + 1 - limit} more transfers`}
          />
        ) : null}
      </Card>
    </Box>
  ) : null;
};
