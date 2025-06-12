import { createMoney } from '@leather.io/utils';

export const SAMPLE_PUBLIC_KEY =
  '8721c6a5237f5e8d361161a7855aa56885a3e19e2ea6ee268fb14eabc5e2ed9001';

export const FEE_CONFIG = {
  feeEstimations: {
    maxValues: [500000, 750000, 2000000],
    maxValuesEnabled: false,
    minValues: [2500, 3000, 3500],
    minValuesEnabled: true,
  },
  tokenTransferFeeEstimations: [200, 400, 800],
  stacksContractCallFeeEstimations: {
    low: { min: 2500, max: 2999 },
    standard: { min: 3000, max: 10000 },
    high: { min: 10000, max: 1000001 },
  },
  stacksContractDeploymentFeeEstimations: {
    low: { min: 10000, max: 50000 },
    standard: { min: 100001, max: 500000 },
    high: { min: 1000001, max: 2000000 },
  },
};

export const feeEstimationsMaxValues = FEE_CONFIG.feeEstimations.maxValuesEnabled
  ? FEE_CONFIG.feeEstimations.maxValues.map(value => createMoney(value, 'STX'))
  : undefined;

export const feeEstimationsMinValues = FEE_CONFIG.feeEstimations.minValuesEnabled
  ? FEE_CONFIG.feeEstimations.minValues.map(value => createMoney(value, 'STX'))
  : undefined;
