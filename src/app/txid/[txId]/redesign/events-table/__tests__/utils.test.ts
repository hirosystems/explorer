import { TxEvent } from '@/common/types/tx-v3';

import { getAmount, getAssetEventType, getFromAddress, getToAddress } from '../utils';

const ADDRESS = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

test('an STX lock shows the locked amount and the locking address', () => {
  const event = {
    event_index: 0,
    type: 'stx_lock',
    stx_lock: { amount: '1000000', unlock_bitcoin_height: 900000, address: ADDRESS },
  } as unknown as TxEvent;

  expect(getAmount(event)).toBe('1000000');
  expect(getFromAddress(event)).toBe(ADDRESS);
  expect(getToAddress(event)).toBe('');
  expect(getAssetEventType(event)).toBe('stx_lock');
});

test('an event type the explorer does not know yet is labelled unknown instead of throwing', () => {
  const event = { event_index: 0, type: 'some_future_event' } as unknown as TxEvent;

  expect(getAssetEventType(event)).toBe('unknown');
});
