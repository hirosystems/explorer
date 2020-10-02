import {
  addressFromPublicKeys,
  AddressHashMode,
  addressToString,
  AddressVersion,
  bufferCVFromString,
  ClarityAbiType,
  ClarityValue,
  deserializeCV,
  falseCV,
  getTypeString,
  intCV,
  isClarityAbiBuffer,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  isClarityAbiResponse,
  isClarityAbiTuple,
  makeRandomPrivKey,
  privateKeyToString,
  pubKeyfromPrivKey,
  publicKeyToString,
  serializeCV,
  StacksNetwork,
  StacksTestnet,
  standardPrincipalCV,
  trueCV,
  uintCV,
} from '@blockstack/stacks-transactions';

import { cvToString } from '@blockstack/stacks-transactions/lib/clarity';
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `Transaction${txid ? `:  ${truncateMiddle(txid)}` : ''} submitted!`,
      description: `Transactions can take 60 or more seconds to confirm.`,
      action: {
        label: 'View transaction',
        onClick: () => {
          void router.push('/txid/[txid]', `/txid/${txid}`);
        },
      },
    });
  return showToast;
};

export const doGenerateIdentity = () => {
  const key = makeRandomPrivKey();
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
  const url = `${network.coreApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${encodeURIComponent(functionName)}`;

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
