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
} from '@store/sandbox';
import { RootState } from '@store';
import { IdentityPayload } from '@store/sandbox/types';
import { withApiServer } from '@common/constants';
import { fetchFromSidecar } from '@common/api/fetch';
import { useToast } from '@common/hooks/use-toast';
import { truncateMiddle } from '@common/utils';
import { useRouter } from 'next/router';

export const useTxToast = () => {
  const router = useRouter();
  const { addPositiveToast } = useToast();

  const showToast = (txid: string) =>
    addPositiveToast({
      message: `Transaction: ${truncateMiddle(txid)} submitted!`,
      description: `Transactions can take 60 or more seconds to confirm.`,
      action: {
        label: 'View transaction',
        onClick: () => {
          router.push('/txid/[txid]', `/txid/${txid}`);
        },
      },
    });
  return showToast;
};

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

export const network = (apiServer: string): StacksNetwork => ({
  version: TransactionVersion.Testnet,
  chainId: ChainID.Testnet,
  coreApiUrl: withApiServer(apiServer)(),
  broadcastApiUrl: withApiServer(apiServer)('/v2/transactions'),
  transferFeeEstimateApiUrl: withApiServer(apiServer)('/v2/fees/transfer'),
  balanceApiUrl: withApiServer(apiServer)('/v2/accounts'),
});

export const fetchContractInterface = (apiServer: string) => async (
  contractAddress: string,
  contractName: string
) => {
  const res = await fetchFromSidecar(apiServer)(`/contract/${contractAddress}.${contractName}`);
  return res.json();
};
