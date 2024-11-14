export const txs = [
  {
    tx_id: '0x1',
    sender_address: 'SP1',
    tx_type: 'contract_call',
    contract_call: {
      contract_id: 'SP1.contract1',
      function_name: 'transaction-1',
    },
  },
  {
    tx_id: '0x2',
    sender_address: 'SP1',
    tx_type: 'token_transfer',
    token_transfer: {
      amount: 1,
    },
  },
  {
    tx_id: '0x3',
    sender_address: 'SP1',
    tx_type: 'coinbase',
  },
  {
    tx_id: '0x4',
    sender_address: 'SP1',
    tx_type: 'smart_contract',
  },
];
