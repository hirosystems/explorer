'use client';

export const mockAddress = 'RWRQ3K1NR0ZE7H';
export const addressTxsMockData = {
  pages: [
    {
      limit: 30,
      offset: 0,
      total: 5,
      results: [
        {
          stx_sent: '123456',
          stx_received: '987654',
          tx: {
            burn_block_time_iso: '2023-05-04T18:10:58.000Z',
            fee_rate: '456789',
            tx_id: 'tx_1234',
            tx_type: 'coinbase',
          },
        },
        {
          stx_sent: '987654',
          stx_received: '234567',
          tx: {
            burn_block_time_iso: '2023-06-12T08:30:15.000Z',
            fee_rate: '789012',
            tx_id: 'tx_5678',
            tx_type: 'token_transfer',
          },
        },
        {
          stx_sent: '234567',
          stx_received: '789012',
          tx: {
            burn_block_time_iso: '2023-07-25T13:45:30.000Z',
            fee_rate: '345678',
            tx_id: 'tx_9012',
            tx_type: 'smart_contract',
          },
        },
        {
          stx_sent: '789012',
          stx_received: '345678',
          tx: {
            burn_block_time_iso: '2023-08-05T16:20:05.000Z',
            fee_rate: '123456',
            tx_id: 'tx_3456',
            tx_type: 'contract_call',
          },
        },
        {
          stx_sent: '345678',
          stx_received: '123456',
          tx: {
            burn_block_time_iso: '2023-09-15T21:05:40.000Z',
            fee_rate: '987654',
            tx_id: 'tx_7890',
            tx_type: 'poison_microblock',
          },
        },
      ],
    },
  ],
  pageParams: [null],
};

export const addressBalanceMockData = {
  stx: {
    balance: '1987654',
  },
};
