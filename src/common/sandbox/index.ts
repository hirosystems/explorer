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
  serializeCV,
  uintCV,
  intCV,
  trueCV,
  falseCV,
  standardPrincipalCV,
  bufferCVFromString,
  getTypeString,
  StacksTestnet,
  deserializeCV,
} from '@blockstack/stacks-transactions';

import {
  openSTXTransfer as _openSTXTransfer,
  openContractDeploy as _openContractDeploy,
  openContractCall as _openContractCall,
  STXTransferOptions,
  ContractCallOptions,
  ContractDeployOptions,
} from '@blockstack/connect';

import { cvToString } from '@blockstack/stacks-transactions/lib/clarity';

import { useSelector } from 'react-redux';
import {
  selectAccountBalance,
  selectAccountNonce,
  selectAccountLoading,
  selectIdentity,
  selectLastFetch,
  selectErrorState,
  selectAccountTransactions,
  selectStxAddress,
  selectUserData,
} from '@store/sandbox';
import { RootState } from '@store';
import { IdentityPayload } from '@store/sandbox/types';
import { IS_DEV, withApiServer } from '@common/constants';
import { fetchFromSidecar } from '@common/api/fetch';
import { useToast } from '@common/hooks/use-toast';
import { truncateMiddle } from '@common/utils';
import { useRouter } from 'next/router';
import { UserData } from 'blockstack/lib/auth/authApp';

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

export const useSandboxState = (): {
  lastFetch?: number;
  loading: string;
  balance?: BN | number;
  transactions?: any;
  nonce?: number;
  identity?: IdentityPayload;
  stxAddress?: string;
  user?: UserData;
  error?: any;
} => {
  const { lastFetch, loading, balance, stxAddress, transactions, user, error } = useSelector(
    (state: RootState) => ({
      lastFetch: selectLastFetch(state),
      loading: selectAccountLoading(state),
      balance: selectAccountBalance(selectStxAddress(state) || '')(state),
      transactions: selectAccountTransactions(selectStxAddress(state) || '')(state),
      nonce: selectAccountNonce(selectIdentity(state)?.address || '')(state),
      identity: selectIdentity(state),
      user: selectUserData(state),
      stxAddress: selectStxAddress(state),
      error: selectErrorState(state),
    })
  );

  return { lastFetch, loading, balance, transactions, stxAddress, user, error };
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

interface ReadOnlyResponse {
  okay: boolean;
  result: string;
}

interface ReadOnlyOptions {
  senderAddress: string;
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
}

const cvToHex = (cv: ClarityValue) => {
  const serialized = serializeCV(cv);
  return `0x${serialized.toString('hex')}`;
};

export const callReadOnlyFunction = async ({
  senderAddress,
  contractName,
  contractAddress,
  functionName,
  functionArgs,
  network,
}: ReadOnlyOptions): Promise<ReadOnlyResponse> => {
  const url = `${
    network.coreApiUrl
  }/v2/contracts/call-read/${contractAddress}/${contractName}/${encodeURIComponent(functionName)}`;

  const args = functionArgs.map(arg => cvToHex(arg));

  const body = JSON.stringify({
    sender: senderAddress,
    arguments: args,
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
};

export const parseReadOnlyResponse = ({ result }: ReadOnlyResponse) => {
  const hex = result.slice(2);
  const bufferCv = Buffer.from(hex, 'hex');
  const clarityValue = deserializeCV(bufferCv);
  return cvToString(clarityValue);
};

const iconPrefix = IS_DEV ? 'http://localhost:3000' : 'https://testnet-explorer.now.sh';

export const defaultOpts = {
  authOrigin: 'https://deploy-preview-301--stacks-authenticator.netlify.app',
  appDetails: {
    name: 'Stacks Explorer',
    icon: iconPrefix + '/app-icon.png',
  },
};

export const openSTXTransfer = async (options: Omit<STXTransferOptions, 'authOrigin'>) =>
  _openSTXTransfer({
    authOrigin: defaultOpts.authOrigin,
    ...options,
  });

export const openContractDeploy = async (options: Omit<ContractDeployOptions, 'authOrigin'>) =>
  _openContractDeploy({
    authOrigin: defaultOpts.authOrigin,
    ...options,
  });

export const openContractCall = async (options: Omit<ContractCallOptions, 'authOrigin'>) =>
  _openContractCall({
    authOrigin: defaultOpts.authOrigin,
    ...options,
  });
