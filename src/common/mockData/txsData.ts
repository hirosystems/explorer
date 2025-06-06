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

export const mockSponsoredTx = {
  tx_id: '0x438405f60647aa3dcada6997e0815f648d6e87bbcf50db5bb71633739e7a17c5',
  nonce: 630813,
  fee_rate: '300',
  sender_address: 'ST2TFVBMRPS5SSNP98DQKQ5JNB2B6NZM91C4K3P7B',
  sponsored: true,
  sponsor_address: 'SP2C2K8XYZFAKEADDRESS',
  post_condition_mode: 'deny',
  post_conditions: [],
  anchor_mode: 'any',
  block_hash: '0x438405f60647aa3dcada6997e0815f648d6e87bbcf50db5bb71633739e7a17c5',
  block_height: 1936631,
  block_time: 1748853614,
  block_time_iso: '2025-06-02T08:40:14.000Z',
  burn_block_time: 1748853352,
  burn_block_height: 53537,
  burn_block_time_iso: '2025-06-02T08:35:52.000Z',
  parent_burn_block_time: 1748853352,
  parent_burn_block_time_iso: '2025-06-02T08:35:52.000Z',
  canonical: true,
  tx_index: 0,
  tx_status: 'success',
  tx_result: {
    hex: '0x0703',
    repr: '(ok true)',
  },
  event_count: 1,
  parent_block_hash: '0x3ab23b8843ee2cc37874acce70559ad6232d7468d22027c86eaa5e3b6bbcbdc9',
  is_unanchored: false,
  microblock_hash: '0x',
  microblock_sequence: 2147483647,
  microblock_canonical: true,
  execution_cost_read_count: 0,
  execution_cost_read_length: 0,
  execution_cost_runtime: 0,
  execution_cost_write_count: 0,
  execution_cost_write_length: 0,
  events: [],
  tx_type: 'smart_contract',
  token_transfer: {
    recipient_address: 'SP3XXK8BG5X7CRH7W07RRJK3JZJXJ799WX3Y0SMCR',
    amount: '1',
    memo: '0x00000000000000000000000000000000000000000000000000000000000000000000',
  },
  smart_contract: {
    contract_id: 'ST2TFVBMRPS5SSNP98DQKQ5JNB2B6NZM91C4K3P7B.my-awesome-contract',
    source_code: `
      (define-public (hello-world)
        (ok "Hello from mock contract"))
    `,
  },
  contract_call: {
    contract_id: 'ST2TFVBMRPS5SSNP98DQKQ5JNB2B6NZM91C4K3P7B.my-awesome-contract',
    function_name: 'transferTokens',
    function_signature: '(define-public (transferTokens))',
    function_args: [],
  },
  tenure_change: {
    old_tenure: '6 months',
    new_tenure: '12 months',
    reason: 'User upgraded subscription',
  },
};
