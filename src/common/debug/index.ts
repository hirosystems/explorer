import { StacksNetwork, TransactionVersion, ChainID } from '@blockstack/stacks-transactions';
import BN from 'bn.js';
import {
  addressFromPublicKeys,
  AddressHashMode,
  addressToString,
  AddressVersion,
  makeRandomPrivKey,
  privateKeyToString,
  pubKeyfromPrivKey,
  publicKeyToString,
} from '@blockstack/stacks-transactions';
import { useSelector } from 'react-redux';
import {
  selectAccountBalance,
  selectAccountNonce,
  selectAccountLoading,
  selectIdentity,
  selectLastFetch,
  selectErrorState,
  selectAccountTransactions,
} from '@store/debug';
import { RootState } from '@store';
import { IdentityPayload } from '@store/debug/types';
import { API_SERVER_ENV } from '@common/constants';
import { fetchFromRootApi } from '@common/api/fetch';

export const useDebugState = (): {
  lastFetch?: number;
  loading: string;
  balance?: BN | number;
  transactions?: any;
  nonce?: number;
  identity?: IdentityPayload;
  error?: any;
} => {
  const { lastFetch, loading, balance, identity, transactions, error } = useSelector(
    (state: RootState) => ({
      lastFetch: selectLastFetch(state),
      loading: selectAccountLoading(state),
      balance: selectAccountBalance(selectIdentity(state)?.address || '')(state),
      transactions: selectAccountTransactions(selectIdentity(state)?.address || '')(state),
      nonce: selectAccountNonce(selectIdentity(state)?.address || '')(state),
      identity: selectIdentity(state),
      error: selectErrorState(state),
    })
  );

  return { lastFetch, loading, balance, transactions, identity, error };
};

export const doGenerateIdentity = async () => {
  const key = await makeRandomPrivKey();
  const publicKey = pubKeyfromPrivKey(privateKeyToString(key));
  const address = addressFromPublicKeys(
    AddressVersion.TestnetSingleSig,
    AddressHashMode.SerializeP2PKH,
    1,
    [publicKey]
  );

  return {
    privateKey: privateKeyToString(key),
    publicKey: publicKeyToString(publicKey),
    address: addressToString(address),
  };
};

export const network: StacksNetwork = {
  version: TransactionVersion.Testnet,
  chainId: ChainID.Testnet,
  coreApiUrl: API_SERVER_ENV,
  broadcastApiUrl: API_SERVER_ENV + '/v2/transactions',
  transferFeeEstimateApiUrl: API_SERVER_ENV + '/v2/fees/transfer',
  balanceApiUrl: API_SERVER_ENV + '/v2/accounts',
};

export const fetchContractInterface = async (contractAddress: string, contractName: string) => {
  const res = await fetchFromRootApi(`/sidecar/v1/contract/${contractAddress}.${contractName}`);
  return res.json();
};
