import { createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '@models/transaction.interface';
import { fetchContract } from '@common/api/contracts';
import { fetchTx } from '@common/api/transactions';
import { queryWith0x } from '@common/utils';
import type { ContractCallTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

const handleContractTx = async (query: string) => {
  const contract = await fetchContract(query);
  return fetchTx(contract.tx_id);
};

const handleContractCallTx = async (tx: ContractCallTransaction) => {
  const { contract_id } = tx.contract_call;
  const originContract = await fetchContract(contract_id);
  return fetchTx(originContract.tx_id);
};

export const fetchTransaction = createAsyncThunk<Transaction[], string>(
  'transaction/fetch',
  async query => {
    const txs = [];
    if (query.includes('.')) {
      const tx = await handleContractTx(query);
      txs.push(tx);
      if (tx.tx_type === 'contract_call') {
        const originTx = await handleContractCallTx(tx);
        txs.push(originTx);
      }
      return txs;
    }
    // searching by a valid id hash
    const tx = await fetchTx(queryWith0x(query));
    txs.push(tx);
    if (tx.tx_type === 'contract_call') {
      const originTx = await handleContractCallTx(tx);
      txs.push(originTx);
    }
    return txs;
  }
);
