/** @jest-environment node */
import { ApiError } from '@/api/ApiError';
import { fetchContractInfo, fetchTx, fetchTxEvents } from '@/api/data-fetchers';
import { notFound } from 'next/navigation';
import { isValidElement } from 'react';

import Page from '../page';

jest.mock('@/api/data-fetchers', () => ({
  fetchContractInfo: jest.fn(),
  fetchTx: jest.fn(),
  fetchTxEvents: jest.fn(),
}));
jest.mock('@/app/getTokenPriceInfo', () => ({
  getTokenPrice: jest.fn().mockResolvedValue({ stxPrice: 1, btcPrice: 2 }),
}));
jest.mock('@/common/utils/error-utils', () => ({ logError: jest.fn() }));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
jest.mock('../PageClient', () => () => null);
jest.mock('../TxIdPageContext', () => ({ TxIdPageDataProvider: () => null }));

const TX_ID = '0xa3a507295688f791c5e4e78ba2d293bd8c415f1232357f82f539410c5ae20dd1';

function renderPage() {
  return Page({
    params: Promise.resolve({ txId: TX_ID }),
    searchParams: Promise.resolve({ chain: 'mainnet' }),
  });
}

beforeEach(() => jest.clearAllMocks());

test('shows the not-found page when the API has no such transaction', async () => {
  jest
    .mocked(fetchTx)
    .mockRejectedValue(
      new ApiError({ message: 'Not Found', status: 404, endpoint: '/x', method: 'GET' })
    );

  await expect(renderPage()).rejects.toThrow('NEXT_NOT_FOUND');
  expect(notFound).toHaveBeenCalled();
});

test('renders without initial data when the transaction fetch fails for another reason', async () => {
  jest
    .mocked(fetchTx)
    .mockRejectedValue(
      new ApiError({ message: 'Unavailable', status: 503, endpoint: '/x', method: 'GET' })
    );

  const element = await renderPage();
  expect(notFound).not.toHaveBeenCalled();
  expect(isValidElement(element) && (element.props as any).initialTxData).toBeUndefined();
});

test('prefetches the events of a contract call whose events fit one request', async () => {
  const tx = {
    tx_id: TX_ID,
    type: 'contract_call',
    status: 'success',
    event_count: 93,
    block: { height: 1, hash: '0x', index_hash: '0x', time: 1, tx_index: 0 },
  };
  const events = { total: 93, limit: 100, cursor: {}, results: [] };
  jest.mocked(fetchTx).mockResolvedValue(tx as never);
  jest.mocked(fetchTxEvents).mockResolvedValue(events as never);

  const element = await renderPage();
  expect(fetchTxEvents).toHaveBeenCalledWith('https://api.hiro.so', TX_ID, 100);
  expect(isValidElement(element) && (element.props as any).initialTxEvents).toBe(events);
  expect(fetchContractInfo).not.toHaveBeenCalled();
});

test('does not prefetch events for transactions that cannot list their transfers', async () => {
  jest.mocked(fetchTx).mockResolvedValue({
    tx_id: TX_ID,
    type: 'contract_call',
    status: 'success',
    event_count: 250,
    block: { height: 1, hash: '0x', index_hash: '0x', time: 1, tx_index: 0 },
  } as never);

  await renderPage();
  expect(fetchTxEvents).not.toHaveBeenCalled();
});
