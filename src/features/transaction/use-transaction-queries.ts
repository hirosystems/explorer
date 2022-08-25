import { apiClients, createConfig } from '@common/api/client';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import {
  AddressBalanceResponse,
  ContractInterfaceResponse,
  MempoolTransaction,
  MempoolTransactionListResponse,
  Transaction,
  TransactionResults,
  AddressTransactionsWithTransfersListResponse,
} from '@stacks/stacks-blockchain-api-types';
import { DEFAULT_LIST_LIMIT, MAX_BLOCK_TRANSACTIONS_PER_CALL } from '@common/constants';
import { TransactionsListResponse } from '@store/transactions';

export const getTransactionQueries = (networkUrl: string) => {
  const clients = apiClients(createConfig(networkUrl));

  const fetchContract = (contractId: string) => async () => {
    const contract = (await clients.smartContractsApi.getContractById({
      contractId,
    })) as any;
    return {
      ...contract,
      abi: contract.abi ? (JSON.parse(contract.abi) as ContractInterfaceResponse) : undefined,
    };
  };

  const fetchBlockTransactions = async (blockHash?: string) => {
    if (!blockHash) return undefined;
    let results: Transaction[] = [];
    let tempResults: TransactionResults;
    let offset = 0;
    do {
      tempResults = (await clients.transactionsApi.getTransactionsByBlockHash({
        blockHash,
        offset,
        limit: MAX_BLOCK_TRANSACTIONS_PER_CALL,
      })) as TransactionResults;
      results = results.concat(tempResults.results);
      offset += tempResults.results.length;
    } while (results.length < tempResults.total);
    return { results };
  };

  const fetchTransactionWithContract = async (txId: string) => {
    const isContractId = txId.includes('.');
    if (!isContractId) {
      const transaction = (await clients.transactionsApi.getTransactionById({
        txId,
      })) as unknown as Transaction | MempoolTransaction;
      return transaction;
    }

    const contractInfo = await fetchContract(txId)();
    const transaction = (await clients.transactionsApi.getTransactionById({
      txId: contractInfo.tx_id,
    })) as Transaction | MempoolTransaction;
    return transaction;
  };

  return {
    fetchBlockTransactions: (blockHash?: string) => () =>
      fetchBlockTransactions(blockHash) as unknown as TransactionsListResponse,
    fetchSingleTransaction: (txId: string) => () => fetchTransactionWithContract(txId),
    fetchTransactionsForAddress:
      (address: string, limit = DEFAULT_LIST_LIMIT, offset = 0) =>
      () => {
        return clients.accountsApi.getAccountTransactions({
          principal: address,
          offset,
          limit,
        }) as unknown as TransactionsListResponse;
      },
    fetchTransactionsWithTransfersForAddress:
      (address: string, limit = DEFAULT_LIST_LIMIT, offset = 0) =>
      () => {
        return clients.accountsApi.getAccountTransactionsWithTransfers({
          principal: address,
          offset,
          limit,
        }) as unknown as AddressTransactionsWithTransfersListResponse;
      },
    fetchMempoolTransactionsForAddress:
      (address: string, limit = DEFAULT_LIST_LIMIT, offset = 0) =>
      () => {
        return clients.transactionsApi.getMempoolTransactionList({
          address,
          offset,
          limit,
        }) as unknown as MempoolTransactionListResponse;
      },
    fetchContract,
    fetchAccountBalance: (address: string) => () => {
      return clients.accountsApi.getAccountBalance({
        principal: address,
      }) as unknown as AddressBalanceResponse;
    },
  };
};

export const useTransactionQueries = () => {
  const network = useAppSelector(selectActiveNetwork);
  return getTransactionQueries(network.url);
};
