import {
  AddressBalanceResponse,
  ContractCallTransaction,
  MempoolTransaction,
} from '@blockstack/stacks-blockchain-api-types';

import { Transaction } from '@models/transaction.interface';

export const hasTokenBalance = (balances?: AddressBalanceResponse) => {
  if (!balances) return 0;
  let totalFt = 0;
  let totalNft = 0;
  if (balances?.fungible_tokens) {
    totalFt =
      (balances.fungible_tokens && Object.keys(balances?.fungible_tokens || {}).length) || 0;
  }
  if (balances.non_fungible_tokens) {
    totalNft = Object.keys(balances?.non_fungible_tokens || {}).length;
  }

  return totalFt + totalNft > 0;
};

export const getStackStartBlockHeight = (transactions?: MempoolTransaction[] | Transaction[]) => {
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
