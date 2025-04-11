// @ts-nocheck
import {
  getMockCurrentStackingCycle,
  getMockMempoolFee,
  getMockMempoolStats,
  getMockRecentBlocks,
  getMockRecentUITxs,
  getMockStxPrice,
} from './mock-data';

// Create mock versions of your API functions
export const getCurrentStxPrice = async () => {
  // Add a small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 10));
  return getMockStxPrice();
};

export const fetchRecentBlocks = async (chain?: string, api?: string) => {
  await new Promise(resolve => setTimeout(resolve, 10));
  return getMockRecentBlocks();
};

export const fetchCurrentStackingCycle = async (chain?: string, api?: string) => {
  await new Promise(resolve => setTimeout(resolve, 10));
  return getMockCurrentStackingCycle();
};

export const fetchRecentUITxs = async (chain?: string, api?: string) => {
  await new Promise(resolve => setTimeout(resolve, 10));
  return getMockRecentUITxs();
};

export const fetchUIMempoolStats = async (chain?: string, api?: string) => {
  await new Promise(resolve => setTimeout(resolve, 10));
  return getMockMempoolStats();
};

export const fetchMempoolFee = async (chain?: string, api?: string) => {
  await new Promise(resolve => setTimeout(resolve, 10));
  return getMockMempoolFee();
};
