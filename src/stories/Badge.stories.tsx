import { Text } from '@/ui/Text';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { Clock } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import {
  Badge,
  BadgeProps,
  BlockHeightBadge,
  TransactionStatusBadge,
  TransactionTypeBadge,
} from '../ui/Badge';

// Mock transaction data for stories
const mockTransaction: Transaction = {
  tx_id: 'tx-id-123',
  tx_type: 'token_transfer',
  tx_status: 'success',
  nonce: 0,
  fee_rate: '100',
  sender_address: 'sender-address',
  sponsored: false,
  post_condition_mode: 'deny',
  post_conditions: [],
  anchor_mode: 'any',
  is_unanchored: false,
  block_hash: 'block-hash',
  block_height: 12345,
  burn_block_time: 1625097600,
  burn_block_time_iso: '2021-07-01T00:00:00.000Z',
  parent_block_hash: 'parent-block-hash',
  parent_burn_block_time: 1625097500,
  parent_burn_block_time_iso: '2021-07-01T00:00:00.000Z',
  canonical: true,
  microblock_hash: 'microblock-hash',
  microblock_sequence: 0,
  microblock_canonical: true,
  execution_cost_read_count: 0,
  execution_cost_read_length: 0,
  execution_cost_runtime: 0,
  execution_cost_write_count: 0,
  execution_cost_write_length: 0,
  tx_index: 0,
  token_transfer: {
    recipient_address: 'recipient-address',
    amount: '1000',
    memo: 'memo',
  },
  block_time: 1625097600,
  block_time_iso: '2021-07-01T00:00:00.000Z',
  burn_block_height: 12345,
  tx_result: {
    hex: '0x01',
    repr: 'true',
  },
  events: [],
  event_count: 0,
};

const mockFailedTransaction: Transaction = {
  ...mockTransaction,
  tx_status: 'abort_by_response',
};

const mockPendingTransaction: MempoolTransaction = {
  tx_id: 'tx-id-456',
  tx_type: 'contract_call',
  tx_status: 'pending',
  receipt_time: 1625097600,
  receipt_time_iso: '2021-07-01T00:00:00.000Z',
  nonce: 1,
  fee_rate: '200',
  sender_address: 'sender-address',
  sponsored: false,
  post_condition_mode: 'deny',
  post_conditions: [],
  anchor_mode: 'any',
  contract_call: {
    contract_id: 'contract-id',
    function_name: 'function-name',
    function_signature: 'function-signature',
    function_args: [],
  },
};

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Block Height Badge Stories
export const StacksBlockHeightBadge: StoryObj<typeof BlockHeightBadge> = {
  render: args => <BlockHeightBadge {...args} blockType="stx" blockHeight={12345} />,
};

export const BitcoinBlockHeightBadge: StoryObj<typeof BlockHeightBadge> = {
  render: args => <BlockHeightBadge {...args} blockType="btc" blockHeight={789012} />,
};

// Transaction Type Badge Stories
export const TransactionTypeBadges: StoryObj<typeof TransactionTypeBadge> = {
  render: args => {
    // Using type assertions for Storybook mock data
    // This is acceptable for UI testing purposes
    const txTypes = [
      { ...mockTransaction, tx_type: 'token_transfer' } as any as Transaction,
      { ...mockTransaction, tx_type: 'contract_call' } as any as Transaction,
      { ...mockTransaction, tx_type: 'smart_contract' } as any as Transaction,
      { ...mockTransaction, tx_type: 'coinbase' } as any as Transaction,
      { ...mockTransaction, tx_type: 'tenure_change' } as any as Transaction,
    ];

    return (
      <Flex direction="column" gap={4}>
        {txTypes.map((tx, index) => (
          <Flex key={index} alignItems="center" gap={4}>
            <Box width="150px">{tx.tx_type}:</Box>
            <TransactionTypeBadge {...args} tx={tx} />
            <TransactionTypeBadge {...args} tx={tx} withoutLabel />
          </Flex>
        ))}
      </Flex>
    );
  },
};

export const TransactionStatusBadges: StoryObj<typeof TransactionStatusBadge> = {
  render: args => {
    const transactions = [
      { tx: mockPendingTransaction, status: 'Pending' as const },
      { tx: mockTransaction, status: 'Success' as const },
      { tx: mockFailedTransaction, status: 'Failed' as const },
    ];

    return (
      <Flex direction="column" gap={4}>
        {transactions.map(({ tx, status }, index) => (
          <Flex key={index} alignItems="center" gap={4}>
            <Box width="150px">{status}:</Box>
            <TransactionStatusBadge {...args} tx={tx} />
            <TransactionStatusBadge {...args} tx={tx} withoutLabel />
          </Flex>
        ))}
      </Flex>
    );
  },
};

export const BadgeVariants: Story = {
  render: () => {
    const variants = ['solid', 'outline', 'subtle'];
    const contents = ['label', 'iconOnly', 'iconAndLabel'];

    return (
      <Flex direction="column" gap={6}>
        {variants.map(variant => (
          <Flex key={variant} direction="column" gap={4}>
            <Box fontWeight="bold">{variant} variant</Box>
            <Flex gap={4}>
              {contents.map(content => (
                <Badge
                  key={content}
                  variant={variant as BadgeProps['variant']}
                  content={content as BadgeProps['content']}
                >
                  {content === 'label' ? (
                    'Badge Text'
                  ) : content === 'iconOnly' ? (
                    <Icon>
                      <Clock />
                    </Icon>
                  ) : (
                    <Flex alignItems="center" gap={2}>
                      <Icon>
                        <Clock />
                      </Icon>
                      <Text>Badge with Icon</Text>
                    </Flex>
                  )}
                </Badge>
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
    );
  },
};
