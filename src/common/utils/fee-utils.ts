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
  console.log('[debug] getStacksFeeEstimate started');

  try {
    const txByteLength = getEstimatedUnsignedStacksTxByteLength(unsignedTx);
    console.log('[debug] txByteLength:', txByteLength);

    const txPayload = getSerializedUnsignedStacksTxPayload(unsignedTx);
    console.log('[debug] txPayload length:', txPayload?.length);

    const feeEstimation = await fetchTxFeeEstimation(txPayload, txByteLength, chain, api);
    console.log('[debug] feeEstimation received successfully');

    console.log('[debug] Raw feeEstimation data before processing:', {
      feeEstimation,
      hasEstimations: !!feeEstimation?.estimations,
      estimationsLength: feeEstimation?.estimations?.length,
      estimationsIsArray: Array.isArray(feeEstimation?.estimations),
      estimationsStructure: feeEstimation?.estimations?.map((est: any, index: number) => ({
        index,
        keys: Object.keys(est || {}),
        hasEstimate: !!est,
        hasEstimateFee: !!est?.fee,
        estimateValue: est,
      })),
    });

    let processedFees;
    try {
      processedFees = parseStacksTxFeeEstimationResponse({
        feeEstimation,
        payloadType: unsignedTx.payload.payloadType,
        maxValues: feeEstimationsMaxValues,
        minValues: feeEstimationsMinValues,
        txByteLength,
        tokenTransferFeeEstimations: FEE_CONFIG.tokenTransferFeeEstimations,
        contractCallDefaultFeeEstimations: FEE_CONFIG.stacksContractCallFeeEstimations,
        contractDeploymentDefaultFeeEstimations: FEE_CONFIG.stacksContractDeploymentFeeEstimations,
      });
    } catch (parseError) {
      console.error('[debug] parseStacksTxFeeEstimationResponse error:', {
        parseError,
        errorMessage: parseError instanceof Error ? parseError.message : String(parseError),
        errorStack: parseError instanceof Error ? parseError.stack : undefined,
        feeEstimation,
        payloadType: unsignedTx.payload.payloadType,
        chain,
        api,
      });
      throw parseError;
    }

    console.log('[debug] processedFees after parsing:', {
      processedFees,
      hasProcessedFees: !!processedFees,
      hasEstimates: !!processedFees?.estimates,
      estimatesLength: processedFees?.estimates?.length,
      estimatesIsArray: Array.isArray(processedFees?.estimates),
      estimatesStructure: processedFees?.estimates?.map((est: any, index: number) => ({
        index,
        keys: Object.keys(est || {}),
        hasEstimate: !!est,
        hasEstimateFee: !!est?.fee,
        estimateValue: est,
      })),
    });

    // Validate that we have valid estimates before trying to access them
    if (!processedFees || !processedFees.estimates || !Array.isArray(processedFees.estimates)) {
      console.error('[debug] Invalid processedFees structure:', {
        processedFees,
        hasProcessedFees: !!processedFees,
        hasEstimates: !!processedFees?.estimates,
        estimatesType: typeof processedFees?.estimates,
        estimatesIsArray: Array.isArray(processedFees?.estimates),
        chain,
        api,
        payloadType: unsignedTx.payload.payloadType,
      });

      // Return default values when estimates are invalid
      const defaultResult = {
        no_priority: 0,
        low_priority: 0,
        medium_priority: 0,
        high_priority: 0,
      };

      console.log('[debug] Returning default fee estimates due to invalid processedFees structure');
      return defaultResult;
    }

    if (processedFees.estimates.length < 3) {
      console.error('[debug] Insufficient estimates in processedFees:', {
        estimatesLength: processedFees.estimates.length,
        estimates: processedFees.estimates,
        chain,
        api,
        payloadType: unsignedTx.payload.payloadType,
      });

      // Return default values when we don't have enough estimates
      const defaultResult = {
        no_priority: 0,
        low_priority: 0,
        medium_priority: 0,
        high_priority: 0,
      };

      console.log('[debug] Returning default fee estimates due to insufficient estimates');
      return defaultResult;
    }

    // Log each estimate before processing
    console.log('[debug] Processing individual estimates:', {
      estimate0: processedFees.estimates[0],
      estimate1: processedFees.estimates[1],
      estimate2: processedFees.estimates[2],
      estimate0Fee: processedFees.estimates[0]?.fee,
      estimate1Fee: processedFees.estimates[1]?.fee,
      estimate2Fee: processedFees.estimates[2]?.fee,
    });

    const result = {
      no_priority: 0,
      low_priority: stxToMicroStx(
        convertAmountToBaseUnit(
          processedFees.estimates[0]?.fee || createMoney(new BigNumber(0), 'STX')
        )
      ).toNumber(),
      medium_priority: stxToMicroStx(
        convertAmountToBaseUnit(
          processedFees.estimates[1]?.fee || createMoney(new BigNumber(0), 'STX')
        )
      ).toNumber(),
      high_priority: stxToMicroStx(
        convertAmountToBaseUnit(
          processedFees.estimates[2]?.fee || createMoney(new BigNumber(0), 'STX')
        )
      ).toNumber(),
    };

    console.log('[debug] getStacksFeeEstimate completed successfully');
    return result;
  } catch (error) {
    console.error(
      '[debug] getStacksFeeEstimate error (chain:',
      chain,
      'api:',
      api,
      'payloadType:',
      unsignedTx.payload.payloadType,
      ')',
      error
    );
    throw error;
  }
}

async function _getSampleTxsFeeEstimate(chain: StacksNetworkName, api: string) {
  console.log('[debug] getSampleTxsFeeEstimate started (chain:', chain, 'api:', api, ')');

  try {
    const { tokenTransferTx, contractCallTx, contractDeployTx } = await generateSampleTxs(chain);
    console.log('[debug] sample txs generated successfully');

    console.log('[debug] Starting parallel fee estimation for all tx types');
    const feeEstimatePromises = [
      getStacksFeeEstimate(tokenTransferTx, chain, api).catch(error => {
        console.error('[debug] tokenTransfer fee estimation failed:', error);
        return {
          no_priority: 0,
          low_priority: 0,
          medium_priority: 0,
          high_priority: 0,
        };
      }),
      getStacksFeeEstimate(contractCallTx, chain, api).catch(error => {
        console.error('[debug] contractCall fee estimation failed:', error);
        return {
          no_priority: 0,
          low_priority: 0,
          medium_priority: 0,
          high_priority: 0,
        };
      }),
      getStacksFeeEstimate(contractDeployTx, chain, api).catch(error => {
        console.error('[debug] contractDeploy fee estimation failed:', error);
        return {
          no_priority: 0,
          low_priority: 0,
          medium_priority: 0,
          high_priority: 0,
        };
      }),
    ];

    const [tokenTransferFees, contractCallFees, contractDeployFees] =
      await Promise.all(feeEstimatePromises);

    console.log('[debug] all fee estimates received:', {
      tokenTransferFees,
      contractCallFees,
      contractDeployFees,
    });

    // Validate that we have valid fee data before calculating averages
    const isValidFeeData = (fees: any) => {
      return (
        fees &&
        typeof fees === 'object' &&
        typeof fees.low_priority === 'number' &&
        typeof fees.medium_priority === 'number' &&
        typeof fees.high_priority === 'number'
      );
    };

    if (
      !isValidFeeData(tokenTransferFees) ||
      !isValidFeeData(contractCallFees) ||
      !isValidFeeData(contractDeployFees)
    ) {
      console.error('[debug] Invalid fee data received:', {
        tokenTransferFeesValid: isValidFeeData(tokenTransferFees),
        contractCallFeesValid: isValidFeeData(contractCallFees),
        contractDeployFeesValid: isValidFeeData(contractDeployFees),
        tokenTransferFees,
        contractCallFees,
        contractDeployFees,
      });
    }

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

    console.log('[debug] calculated averageFees:', averageFees);

    const result = {
      tokenTransferFees,
      contractCallFees,
      contractDeployFees,
      averageFees,
    };

    console.log('[debug] getSampleTxsFeeEstimate completed successfully');
    return result;
  } catch (error) {
    console.error('[debug] getSampleTxsFeeEstimate error (chain:', chain, 'api:', api, '):', {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

// Cache the entire fee estimation result for 1.5 minutes since transactions are hardcoded
const cachedGetSampleTxsFeeEstimate = unstable_cache(
  _getSampleTxsFeeEstimate,
  ['sample-txs-fee-estimate'],
  {
    tags: ['sample-txs-fee-estimate'],
    revalidate: 90, // 1.5 minutes
  }
);

// Wrapper to add cache hit/miss logging
export async function getSampleTxsFeeEstimate(chain: StacksNetworkName, api: string) {
  const startTime = Date.now();
  const cacheKey = `${chain}-${api || 'default'}`;

  console.log('[debug] getSampleTxsFeeEstimate cache check started for key:', cacheKey);

  try {
    const result = await cachedGetSampleTxsFeeEstimate(chain, api);
    const duration = Date.now() - startTime;

    // If the call completed very quickly (< 100ms), it's likely a cache hit
    if (duration < 100) {
      console.log(
        '[debug] CACHE HIT - entire fee estimation result cached, duration:',
        duration,
        'ms'
      );
    } else {
      console.log(
        '[debug] CACHE MISS - fetched new fee estimation data, duration:',
        duration,
        'ms'
      );
    }

    return result;
  } catch (error) {
    console.error('[debug] getSampleTxsFeeEstimate cache wrapper error:', error);
    throw error;
  }
}
