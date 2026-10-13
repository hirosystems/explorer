import { TransactionStatus } from '@/common/constants/constants';
import { Text } from '@/ui/Text';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { Clock } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Badge,
  BadgeProps,
  BlockHeightBadge,
  TransactionStatusBadge,
  TransactionTypeBadge,
} from '../ui/Badge';

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
    const txTypes = [
      'token_transfer',
      'contract_call',
      'smart_contract',
      'coinbase',
      'tenure_change',
    ];

    return (
      <Flex direction="column" gap={4}>
        {txTypes.map(txType => (
          <Flex key={txType} alignItems="center" gap={4}>
            <Box width="150px">{txType}:</Box>
            <TransactionTypeBadge {...args} txType={txType} />
            <TransactionTypeBadge {...args} txType={txType} withoutLabel />
          </Flex>
        ))}
      </Flex>
    );
  },
};

export const TransactionStatusBadges: StoryObj<typeof TransactionStatusBadge> = {
  render: args => {
    const statuses = [
      { status: TransactionStatus.PENDING, label: 'Pending' },
      { status: TransactionStatus.SUCCESS_ANCHOR_BLOCK, label: 'Success' },
      { status: TransactionStatus.FAILED, label: 'Failed' },
    ];

    return (
      <Flex direction="column" gap={4}>
        {statuses.map(({ status, label }) => (
          <Flex key={label} alignItems="center" gap={4}>
            <Box width="150px">{label}:</Box>
            <TransactionStatusBadge {...args} status={status} />
            <TransactionStatusBadge {...args} status={status} withoutLabel />
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
