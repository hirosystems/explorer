import { fetchTxFeeEstimation } from '@/app/data';
import {
  FEE_CONFIG,
  SAMPLE_PUBLIC_KEY,
  feeEstimationsMaxValues,
  feeEstimationsMinValues,
} from '@/app/feeConfig';
import {
  getEstimatedUnsignedStacksTxByteLength,
  getSerializedUnsignedStacksTxPayload,
  parseStacksTxFeeEstimationResponse,
} from '@leather.io/query';
import {
  StacksUnsignedContractCallOptions,
  StacksUnsignedContractDeployOptions,
  StacksUnsignedTokenTransferOptions,
  TransactionTypes,
  generateStacksUnsignedTransaction,
} from '@leather.io/stacks';
import { convertAmountToBaseUnit, createMoney, stxToMicroStx } from '@leather.io/utils';
import BigNumber from 'bignumber.js';
import { unstable_cache } from 'next/cache';

import { StacksNetworkName } from '@stacks/network';
import { StacksTransactionWire } from '@stacks/transactions-v7';

export function createSampleTokenTransferOptions(
  network: StacksNetworkName
): StacksUnsignedTokenTransferOptions {
  return {
    txType: TransactionTypes.StxTokenTransfer,
    fee: createMoney(new BigNumber(0), 'STX'),
    nonce: '1',
    recipient: 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH',
    amount: createMoney(new BigNumber(100), 'STX'),
    publicKey: SAMPLE_PUBLIC_KEY,
    network,
  };
}

export function createSampleContractCallOptions(
  network: StacksNetworkName
): StacksUnsignedContractCallOptions {
  return {
    txType: TransactionTypes.ContractCall,
    contractAddress: 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH',
    contractName: 'hello-world',
    functionName: 'print',
    fee: createMoney(new BigNumber(0), 'STX'),
    functionArgs: [],
    nonce: '1',
    postConditions: [],
    publicKey: SAMPLE_PUBLIC_KEY,
    network,
  };
}

export function createSampleContractDeployOptions(
  network: StacksNetworkName
): StacksUnsignedContractDeployOptions {
  return {
    txType: TransactionTypes.ContractDeploy,
    codeBody: '(define-public (print) (ok "Hello, world!"))',
    contractName: 'hello-world',
    fee: createMoney(new BigNumber(0), 'STX'),
    nonce: '1',
    publicKey: SAMPLE_PUBLIC_KEY,
    network,
  };
}

export async function generateSampleTxs(network: StacksNetworkName) {
  const [tokenTransferTx, contractCallTx, contractDeployTx] = await Promise.all([
    generateStacksUnsignedTransaction(createSampleTokenTransferOptions(network)),
    generateStacksUnsignedTransaction(createSampleContractCallOptions(network)),
    generateStacksUnsignedTransaction(createSampleContractDeployOptions(network)),
  ]);

  return {
    tokenTransferTx,
    contractCallTx,
    contractDeployTx,
  };
}

async function getStacksFeeEstimate(unsignedTx: StacksTransactionWire, chain: string, api: string) {
  const txByteLength = getEstimatedUnsignedStacksTxByteLength(unsignedTx);
  const txPayload = getSerializedUnsignedStacksTxPayload(unsignedTx);

  const feeEstimation = await fetchTxFeeEstimation(txPayload, txByteLength, chain, api);

  const processedFees = parseStacksTxFeeEstimationResponse({
    feeEstimation,
    payloadType: unsignedTx.payload.payloadType,
    maxValues: feeEstimationsMaxValues,
    minValues: feeEstimationsMinValues,
    txByteLength,
    tokenTransferFeeEstimations: FEE_CONFIG.tokenTransferFeeEstimations,
    contractCallDefaultFeeEstimations: FEE_CONFIG.stacksContractCallFeeEstimations,
    contractDeploymentDefaultFeeEstimations: FEE_CONFIG.stacksContractDeploymentFeeEstimations,
  });

  return {
    no_priority: 0,
    low_priority: stxToMicroStx(convertAmountToBaseUnit(processedFees.estimates[0].fee)).toNumber(),
    medium_priority: stxToMicroStx(
      convertAmountToBaseUnit(processedFees.estimates[1].fee)
    ).toNumber(),
    high_priority: stxToMicroStx(
      convertAmountToBaseUnit(processedFees.estimates[2].fee)
    ).toNumber(),
  };
}

async function fetchSampleTxsFeeEstimate(chain: StacksNetworkName, api: string) {
  const { tokenTransferTx, contractCallTx, contractDeployTx } = await generateSampleTxs(chain);
  const [tokenTransferFees, contractCallFees, contractDeployFees] = await Promise.all([
    getStacksFeeEstimate(tokenTransferTx, chain, api),
    getStacksFeeEstimate(contractCallTx, chain, api),
    getStacksFeeEstimate(contractDeployTx, chain, api),
  ]);

  const averageFees = {
    no_priority: 0,
    low_priority: Math.round(
      (tokenTransferFees.low_priority +
        contractCallFees.low_priority +
        contractDeployFees.low_priority) /
        3
    ),
    medium_priority: Math.round(
      (tokenTransferFees.medium_priority +
        contractCallFees.medium_priority +
        contractDeployFees.medium_priority) /
        3
    ),
    high_priority: Math.round(
      (tokenTransferFees.high_priority +
        contractCallFees.high_priority +
        contractDeployFees.high_priority) /
        3
    ),
  };

  return {
    tokenTransferFees,
    contractCallFees,
    contractDeployFees,
    averageFees,
  };
}

const cachedFeeEstimate = unstable_cache(
  async (chain: StacksNetworkName, api: string) => {
    const execStartTime = Date.now();
    const result = await fetchSampleTxsFeeEstimate(chain, api);
    return result;
  },
  ['sample-txs-fee-estimate'],
  {
    tags: ['sample-txs-fee-estimate'],
    revalidate: 120, // 2 minutes
  }
);

export async function getSampleTxsFeeEstimate(chain: StacksNetworkName, api: string) {
  return await cachedFeeEstimate(chain, api);
}
