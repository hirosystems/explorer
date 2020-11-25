import * as React from 'react';
import dynamic from 'next/dynamic';

import type { FetchTransactionResponse } from '@common/api/transactions';
import type {
  CoinbaseTxs,
  ContractCallTxs,
  ContractDeployTxs,
  PoisonMicroblockTxs,
  TokenTransferTxs,
  TxData,
} from '@common/types/tx';
import type { Block } from '@blockstack/stacks-blockchain-api-types';

const CoinbasePage = dynamic(() => import('../components/tx/coinbase'));
const ContractCallPage = dynamic(() => import('../components/tx/contract-call'));
const PoisonMicroblockPage = dynamic(() => import('../components/tx/poison-microblock'));
const SmartContractPage = dynamic(() => import('../components/tx/smart-contract'));
const TokenTransferPage = dynamic(() => import('../components/tx/token-transfer'));

export const renderTxPageComponent = (data: FetchTransactionResponse, block?: Block) => {
  if ('transaction' in data) {
    switch (data.transaction.tx_type) {
      case 'coinbase':
        return <CoinbasePage {...(data as TxData<CoinbaseTxs>)} block={block} />;
      case 'token_transfer':
        return <TokenTransferPage {...(data as TxData<TokenTransferTxs>)} block={block} />;
      case 'contract_call':
        return <ContractCallPage {...(data as TxData<ContractCallTxs>)} block={block} />;
      case 'smart_contract':
        return <SmartContractPage {...(data as TxData<ContractDeployTxs>)} block={block} />;
      case 'poison_microblock':
        return <PoisonMicroblockPage {...(data as TxData<PoisonMicroblockTxs>)} block={block} />;
      default:
        throw new Error('Must pass valid transaction type');
    }
  }
  return null;
};
