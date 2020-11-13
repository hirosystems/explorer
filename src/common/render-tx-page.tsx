import * as React from 'react';

import CoinbasePage from '@components/tx/coinbase';
import ContractCallPage from '@components/tx/contract-call';
import PoisonMicroblockPage from '@components/tx/poison-microblock';
import SmartContractPage from '@components/tx/smart-contract';
import TokenTransferPage from '@components/tx/token-transfer';
import { FetchTransactionResponse } from '@common/api/transactions';
import type {
  ContractCallTxs,
  ContractDeployTxs,
  PoisonMicroblockTxs,
  TokenTransferTxs,
  TxData,
} from '@common/types/tx';

export const renderTxPageComponent = (data: FetchTransactionResponse) => {
  if ('transaction' in data) {
    switch (data.transaction.tx_type) {
      case 'coinbase':
        return <CoinbasePage {...data} />;
      case 'token_transfer':
        return <TokenTransferPage {...(data as TxData<TokenTransferTxs>)} />;
      case 'contract_call':
        return <ContractCallPage {...(data as TxData<ContractCallTxs>)} />;
      case 'smart_contract':
        return <SmartContractPage {...(data as TxData<ContractDeployTxs>)} />;
      case 'poison_microblock':
        return <PoisonMicroblockPage {...(data as TxData<PoisonMicroblockTxs>)} />;
      default:
        throw new Error('Must pass valid transaction type');
    }
  }
  return null;
};
