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
import { withApiServer } from '@common/constants';
import { fetchFromSidecar } from '@common/api/fetch';

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

const broadcastApiUrl = withApiServer('/v2/transactions');
const transferFeeEstimateApiUrl = withApiServer('/v2/fees/transfer');
const balanceApiUrl = withApiServer('/v2/accounts');

export const network: StacksNetwork = {
  version: TransactionVersion.Testnet,
  chainId: ChainID.Testnet,
  coreApiUrl: withApiServer(),
  broadcastApiUrl,
  transferFeeEstimateApiUrl,
  balanceApiUrl,
};

export const fetchContractInterface = async (contractAddress: string, contractName: string) => {
  const res = await fetchFromSidecar(`/contract/${contractAddress}.${contractName}`);
  return res.json();
};
