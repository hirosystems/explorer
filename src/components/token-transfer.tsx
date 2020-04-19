import * as React from 'react';
import { Box, Flex, ChevronIcon, FlexProps, Text, BoxProps } from '@blockstack/ui';
import { Card } from '@components/card';
import { Caption, SectionTitle } from '@components/typography';
import { useHover } from 'use-events';
import { TokenTransferTransaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { truncateMiddle } from '@common/utils';

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
const TokenTransferItem = ({ data, noBottomBorder, ...flexProps }: TokenTransferItemProps) => (
  <Flex
    flexWrap="wrap"
    borderBottom={noBottomBorder ? 'unset' : '1px solid'}
    borderColor="inherit"
    px="base-loose"
    py="loose"
    {...flexProps}
  >
    <Flex align="center" pr="base">
      <Box mr="tight" size="24px" borderRadius="6px" bg={'blue'} />
      <Text>{renderName(data.event_type)}</Text>
    </Flex>
    <Flex
      flexGrow={1}
      justify={['space-between', 'space-between', 'space-evenly']}
      pt={['base', 'base', 'unset']}
    >
      <CellItem value={data.asset?.amount} label={renderLabel(data.asset?.asset_event_type)} />
      {data.asset?.sender ? (
        <CellItem value={truncateMiddle(data.asset?.sender)} label="From" />
      ) : null}
      {data.asset?.recipient ? (
        <CellItem value={truncateMiddle(data.asset?.recipient)} label="To" />
      ) : null}
    </Flex>
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
  return events?.length ? (
    <Box mt="extra-loose" {...boxProps}>
      <SectionTitle mb="base-loose">Token transfers</SectionTitle>
      <Card>
        {events.map(
          (event: EventSingle, key) =>
            key <= limit && (
              <TokenTransferItem
                noBottomBorder={
                  (key === limit - 1 && events?.length > limit) || key === events?.length - 1
                }
                data={event}
                key={key}
              />
            )
        )}
        {events.length > limit ? (
          <BottomButton
            icon={() => <ChevronIcon direction="down" size={6} color="currentColor" />}
            label={`${events.length + 1 - limit} more transfers`}
          />
        ) : null}
      </Card>
    </Box>
  ) : null;
};
