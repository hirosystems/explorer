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
  ClarityValue,
  ClarityAbiType,
  isClarityAbiPrimitive,
  isClarityAbiBuffer,
  isClarityAbiResponse,
  isClarityAbiOptional,
  isClarityAbiTuple,
  isClarityAbiList,
  abiFunctionToString,
  uintCV,
  intCV,
  trueCV,
  falseCV,
  standardPrincipalCV,
  bufferCVFromString,
  getTypeString,
  StacksTestnet,
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

export interface ClarityFunctionArg {
  name: string;
  type: ClarityAbiType;
}

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

export const network = (apiServer: string): StacksNetwork => {
  const txNetwork = new StacksTestnet();
  txNetwork.coreApiUrl = withApiServer(apiServer)();
  return txNetwork;
};

export const fetchContractInterface = (apiServer: string) => async (
  contractAddress: string,
  contractName: string
) => {
  const res = await fetchFromSidecar(apiServer)(`/contract/${contractAddress}.${contractName}`);
  return res.json();
};

export function valueToClarityValue(answer: any, arg: ClarityFunctionArg): ClarityValue {
  const type = arg.type;
  const typeString = getTypeString(type);
  console.log(type, typeString);
  if (isClarityAbiPrimitive(type)) {
    if (type === 'uint128') {
      return uintCV(answer);
    } else if (type === 'int128') {
      return intCV(answer);
    } else if (type === 'bool') {
      return answer == 'True' ? trueCV() : falseCV();
    } else if (type === 'principal') {
      // TODO handle contract principals
      return standardPrincipalCV(answer);
    } else {
      throw new Error(`Contract function contains unsupported Clarity ABI type: ${typeString}`);
    }
  } else if (isClarityAbiBuffer(type)) {
    console.log('is buffer');
    return bufferCVFromString(answer);
  } else if (isClarityAbiResponse(type)) {
    throw new Error(`Contract function contains unsupported Clarity ABI type: ${typeString}`);
  } else if (isClarityAbiOptional(type)) {
    throw new Error(`Contract function contains unsupported Clarity ABI type: ${typeString}`);
  } else if (isClarityAbiTuple(type)) {
    throw new Error(`Contract function contains unsupported Clarity ABI type: ${typeString}`);
  } else if (isClarityAbiList(type)) {
    throw new Error(`Contract function contains unsupported Clarity ABI type: ${typeString}`);
  } else {
    throw new Error(`Contract function contains unsupported Clarity ABI type: ${typeString}`);
  }
}
