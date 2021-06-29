import {
  CoinbaseTransaction,
  ContractCallTransaction,
  MempoolCoinbaseTransaction,
  MempoolContractCallTransaction,
  MempoolPoisonMicroblockTransaction,
  MempoolSmartContractTransaction,
  MempoolTokenTransferTransaction,
  PoisonMicroblockTransaction,
  SmartContractTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';
import { Contract } from '@models/contract.interface';

export type TokenTransferTxs = TokenTransferTransaction | MempoolTokenTransferTransaction;
export type CoinbaseTxs = CoinbaseTransaction | MempoolCoinbaseTransaction;
export type PoisonMicroblockTxs = PoisonMicroblockTransaction | MempoolPoisonMicroblockTransaction;
export type ContractCallTxs = ContractCallTransaction | MempoolContractCallTransaction;
export type ContractDeployTxs = SmartContractTransaction | MempoolSmartContractTransaction;
export type NonContractTxs = TokenTransferTxs | CoinbaseTxs | PoisonMicroblockTxs;

interface Tx<T> {
  transaction: T;
}

interface TxDataWithContract<T = Transaction> extends Tx<T> {
  contract?: Contract;
}

interface TxDataContractCall {
  transaction: ContractCallTxs;
  source: TxDataWithContract<ContractDeployTxs>;
}

type TxDataContractDeploy = TxDataWithContract<ContractDeployTxs>;

export type TxData<T> = T extends NonContractTxs
  ? Tx<T>
  : T extends MempoolSmartContractTransaction
  ? Tx<MempoolSmartContractTransaction>
  : T extends ContractCallTxs
  ? TxDataContractCall
  : TxDataContractDeploy;
