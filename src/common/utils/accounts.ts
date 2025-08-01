'use client';

import {
  AddressBalanceResponse,
  ContractCallTransaction,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

export const hasTokenBalance = (balances?: AddressBalanceResponse) => {
  if (!balances) return false;
  let totalFt = 0;
  let totalNft = 0;
  if (balances?.fungible_tokens) {
    Object.keys(balances?.fungible_tokens || {}).forEach(key => {
      totalFt += parseInt(balances?.fungible_tokens?.[key]?.balance || '0');
    });
  }
  if (balances.non_fungible_tokens) {
    totalNft = Object.keys(balances?.non_fungible_tokens || {}).length;
  }

  return totalFt + totalNft > 0;
};

export const hasStxBalance = (balances?: AddressBalanceResponse) => {
  if (!balances) return false;

  let hasBalance = false;
  if (balances?.stx) {
    const { balance, total_sent, total_received, total_fees_sent, total_miner_rewards_received } =
      balances?.stx;

    const total =
      parseInt(balance) +
      parseInt(total_sent || '0') +
      parseInt(total_received || '0') +
      parseInt(total_fees_sent || '0') +
      parseInt(total_miner_rewards_received || '0');
    if (total > 0) {
      hasBalance = true;
    }
  }

  return hasBalance;
};

export const getStackingStartBlockHeight = (transactions?: Transaction[]) => {
  if (transactions && transactions.length) {
    const latestStackStxTx = (transactions as any).find(
      (tx: MempoolTransaction | Transaction) =>
        tx.tx_type === 'contract_call' &&
        tx.tx_status === 'success' &&
        tx.contract_call.function_name === 'stack-stx'
    );

    const startBurnHeight =
      latestStackStxTx &&
      (latestStackStxTx as ContractCallTransaction)?.contract_call?.function_args?.find(
        arg => arg?.name === 'start-burn-ht'
      );

    return startBurnHeight?.repr?.replace('u', '');
  }
};
