import * as React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import { Badge } from '@components/badge';
import { Caption } from '@components/typography';
import { Card } from '@components/card';
import { toSnakeCase } from '@common/utils';

interface TxSchema {
  txid: string;
  sender: string;
  recipient: string;
  type: number;
  fees: {
    amount: string | number;
    currency: string;
  };
  block: number;
  post_conditions: string;
  sponsored: boolean;
  state: string;
  timestamp: number;
}

interface TxSchema {
  txid: string;
  sender: string;
  recipient: string;
  type: number;
  fees: {
    amount: string | number;
    currency: string;
  };
  block: number;
  post_conditions: string;
  sponsored: boolean;
  state: string;
  timestamp: number;
}

const FeesComponent = ({
  fees: { amount, currency },
  sponsored,
}: {
  fees: {
    amount: string | number;
    currency: string;
  };
  sponsored: boolean;
}) => (
  <>
    <Box>
      <Text>
        {amount} {currency}
      </Text>
    </Box>
    {sponsored ? (
      <Badge ml="base" bg="ink.300">
        Sponsored
      </Badge>
    ) : null}
  </>
);

const Timestamp = ({ ts }: { ts: number }) => (
  <Flex>
    <Box>icon</Box>
    <Box>
      <Text>{ts}</Text>
    </Box>
  </Flex>
);

const BlockComponent = ({ block, ts }: { block: number | string; ts: number }) => (
  <>
    <Box>{block}</Box>
    <Box ml="base">
      <Timestamp ts={ts} />
    </Box>
  </>
);

const transformDataToRowData = (d: TxSchema) => {
  return [
    {
      label: 'Transaction ID',
      children: d.txid,
    },
    {
      label: 'Contract address',
      children: d.sender,
    },
    {
      label: 'Called by',
      children: d.recipient,
    },
    {
      label: 'Transaction fees',
      children: <FeesComponent fees={d.fees} sponsored={d.sponsored} />,
    },
    {
      label: 'Block',
      children: <BlockComponent block={d.block} ts={d.timestamp} />,
    },
  ];
};

interface RowProps {
  card?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  label: string;
  render: any;
}
const Row: React.FC<RowProps> = ({ card, isFirst, isLast, label, render }) => {
  const id = toSnakeCase(label);
  return (
    <Flex
      direction={['column', 'column', 'row']}
      py={['base', 'base', 'loose']}
      borderTop={isFirst && !card ? '1px solid' : undefined}
      borderBottom={isLast && card ? undefined : '1px solid'}
      borderColor="inherit"
      px={card ? 'base' : 'unset'}
      width="100%"
      align={['unset', 'unset', 'center']}
    >
      <Box flexShrink={0} width="140px">
        <Caption id={id} aria-label={label} pb={['extra-tight', 'extra-tight', 'unset']}>
          {label}
        </Caption>
      </Box>
      <Flex aria-labelledby={id} style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
        {render}
      </Flex>
    </Flex>
  );
};

interface RowsProps {
  card?: boolean;
  childComponent?: React.FC<RowProps>;
  items: TxSchema;
}

export const Rows: React.FC<RowsProps> = ({ card, childComponent, items, ...props }) => {
  const Component = card ? Card : Box;
  const ChildComponent = childComponent || Row;
  return (
    <Component width="100%" {...props}>
      {transformDataToRowData(items).map(({ label, children }, key, arr) => (
        <ChildComponent
          card={card}
          isFirst={key === 0}
          isLast={key === arr.length - 1}
          label={label}
          render={children}
          key={key}
        />
      ))}
    </Component>
  );
};
