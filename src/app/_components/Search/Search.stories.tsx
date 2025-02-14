import { Story } from '@storybook/blocks';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Search } from './Search';

const meta = {
  title: 'Components/Search',
  component: Search,
  parameters: {
    layout: 'centered',
    backgrounds: {
      values: [
        { name: 'dark', value: '#0C0C0D' },
        { name: 'light', value: '#EAE8E6' },
      ],
      default: 'light',
    },
  },

  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ height: '800px', width: '507px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

const recentResults = [
  'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
  {
    tx_type: 'token_transfer',
    sender_address: 'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
    token_transfer: {
      amount: '100000000',
      recipient_address: 'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
    },
  } as any,
  {
    tx_id: '0xhnvgfdoiufgyo79ryg907h3',
    tx_type: 'contract_call',
    sender_address: 'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
    contract_call: {
      function_name: 'swap-x-y',
    },
    tx_status: 'pending',
  } as any,
  {
    tx_id: '0x1234567890',
    tx_type: 'smart_contract',
    sender_address: 'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
    smart_contract: {
      contract_id: 'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG.xverse-pool-v02-1',
    },
    tx_status: 'success',
  } as any,
  {
    tx_id: '0x1234567890',
    tx_type: 'coinbase',
    sender_address: 'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
    tx_status: 'success',
  } as any,
  {
    tx_id: '0x1234567890',
    tx_type: 'tenure_change',
    sender_address: 'SP3AGWHGA',
    tx_status: 'success',
  } as any,
  {
    bns: 'andres.btc',
    address: 'SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
  },
  {
    height: 123456,
    hash: '0x1234567890',
  },
  'FROM: andres.btc BEFORE: 2024-01-01 TO: SP3AGWHGAZKQS4JQ67WQZW5X8HZYZ4ZBWPPJBE6RG',
];

export const Primary: Story = {
  args: {
    recentResults,
  },
};
