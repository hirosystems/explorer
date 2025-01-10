import type { NextApiRequest, NextApiResponse } from 'next';

import { getBanditState, saveBanditState } from '../common/utils/bandit';
import { linucbChooseAction } from '../common/utils/linucb';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST method' });
  }

  const { userId, eventData } = req.body;

  const { tx_type, token_transfer, contract_call, burn_block_time } = eventData;

  let isTokenTransfer = 0;
  let isContractCall = 0;
  let tokenAmount = 0;
  let isRecipientInteresting = 0;
  let isContractInteresting = 0;

  const MAX_TOKEN_AMOUNT = 1000000 * 1000000; // 1M STX

  const state = getBanditState();

  if (!state.users[userId]) {
    console.log(`user state not found, initializing`);
    state.users[userId] = {
      preferences: {
        interestingContracts: [],
        interestingAddresses: [],
      },
      linucb: {
        dimension: 7,
        alpha: 10.0,
        actions: {
          '0': {
            A: Array(7)
              .fill(0)
              .map(() => Array(7).fill(0)),
            b: Array(7).fill(0),
          },
          '1': {
            A: Array(7)
              .fill(0)
              .map(() => Array(7).fill(0)),
            b: Array(7).fill(0),
          },
        },
      },
    };
  } else {
    console.log(`found user state`, state.users[userId]);
  }

  const userPreferences = state.users[userId].preferences;

  if (tx_type === 'token_transfer' && token_transfer) {
    isTokenTransfer = 1;
    const rawAmount = token_transfer.amount;
    const numericAmount = typeof rawAmount === 'number' ? rawAmount : parseFloat(rawAmount);
    tokenAmount = numericAmount / MAX_TOKEN_AMOUNT;
    tokenAmount = tokenAmount > 1000000 ? 1000000 : tokenAmount; // Cap at 1 mil

    isRecipientInteresting = userPreferences.interestingAddresses.includes(
      token_transfer.recipient_address
    )
      ? 1
      : 0;
  } else if (tx_type === 'contract_call' && contract_call) {
    isContractCall = 1;
    isContractInteresting = userPreferences.interestingContracts.includes(contract_call.contract_id)
      ? 1
      : 0;
  }

  const eventDate = new Date(burn_block_time);
  const hour = eventDate.getHours() / 24; // Normalize to [0,1]
  const bias = 1; // constant

  const contextVector = [
    isTokenTransfer,
    isContractCall,
    tokenAmount,
    isRecipientInteresting,
    isContractInteresting,
    hour,
    bias,
  ];

  const action = linucbChooseAction(userId, contextVector);

  saveBanditState();

  res.status(200).json({ action });
}
