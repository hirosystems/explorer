import * as React from 'react';
import { Provider } from 'jotai';
import { TransactionMeta } from '@components/meta/transactions';
import { TransactionPageComponent } from '@components/transaction-page-component';

import { isPendingTx, queryWith0x } from '@common/utils';
import { getApiClients } from '@common/api/client';

import { initialDataAtom } from '@store/query';
import { makeTransactionSingleKey } from '@store/transactions';
import { makeBlocksSingleKey } from '@store/blocks';
import { currentlyInViewState } from '@store/app';
import {
  makeContractsInfoQueryKey,
  makeContractsInterfaceQueryKey,
  makeContractsSourceQueryKey,
} from '@store/contracts';

import type {
  MempoolTransaction,
  Transaction,
  Block,
  ContractInterfaceResponse,
  ContractSourceResponse,
} from '@stacks/stacks-blockchain-api-types';
import type { NextPage, NextPageContext } from 'next';

interface TransactionPageData {
  transaction: MempoolTransaction | Transaction;
  txId: string;
  block?: Block;
  contractId?: string;
  contractSource?: ContractSourceResponse;
  contractInterface?: ContractInterfaceResponse;
  contractInfo?: any; // TODO: find type
}

const TransactionPage: NextPage<TransactionPageData> = props => {
  const { transaction, txId, block, contractId, contractSource, contractInterface, contractInfo } =
    props;

  const initialValues: any =
    // TODO: find right type
    [
      [initialDataAtom(makeTransactionSingleKey(txId)), transaction] as const,
      [currentlyInViewState, { type: 'tx', payload: transaction.tx_id }] as const,
    ];

  // it's a confirmed transaction, populate block
  if (block) {
    const blockSingleQueryKey = makeBlocksSingleKey(block.hash);
    initialValues.push([initialDataAtom(blockSingleQueryKey), block] as const);
  }

  // there is an associated contract with this txid
  if (contractId) {
    initialValues.push([
      initialDataAtom(makeContractsInterfaceQueryKey(contractId)),
      contractInterface,
    ] as const);
    initialValues.push([
      initialDataAtom(makeContractsSourceQueryKey(contractId)),
      contractSource,
    ] as const);
    initialValues.push([
      initialDataAtom(makeContractsInfoQueryKey(contractId)),
      contractInfo,
    ] as const);
  }

  return (
    <Provider initialValues={initialValues}>
      <TransactionMeta />
      <TransactionPageComponent />
    </Provider>
  );
};

TransactionPage.getInitialProps = async (
  context: NextPageContext
): Promise<TransactionPageData> => {
  // get our network aware api clients
  const { transactionsApi, blocksApi, smartContractsApi } = await getApiClients(context);

  const txId = context?.query?.txid ? queryWith0x(context.query?.txid.toString()) : '';

  if (txId === '') throw Error('No txid');

  const transaction = (await transactionsApi.getTransactionById({ txId })) as
    | MempoolTransaction
    | Transaction;

  // our other data
  let block = undefined;
  let contractId = undefined;
  let contractInterface = undefined;
  let contractSource = undefined;
  let contractInfo = undefined;

  // if it has a contract associated with it
  if (transaction.tx_type === 'contract_call') contractId = transaction.contract_call.contract_id;
  if (transaction.tx_type === 'smart_contract') contractId = transaction.smart_contract.contract_id;

  // if it's not pending, we should fetch some associated information for this transaction
  if (!isPendingTx(transaction)) {
    // fetch the anchor block
    const hash = (transaction as Transaction).block_hash;
    block = (await blocksApi.getBlockByHash({ hash })) as Block;
  }

  if (contractId) {
    const [contractAddress, contractName] = contractId.split('.');
    const data = await Promise.all([
      smartContractsApi.getContractInterface({ contractAddress, contractName }),
      smartContractsApi.getContractSource({ contractAddress, contractName }),
      smartContractsApi.getContractById({ contractId }),
    ]);
    contractInterface = data[0];
    contractSource = data[1];
    contractInfo = data[2];
  }

  return {
    transaction,
    block,
    txId,
    contractId,
    contractInterface,
    contractSource,
    contractInfo,
  };
};

export default TransactionPage;
