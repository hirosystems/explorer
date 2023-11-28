import { useQuery } from '@tanstack/react-query';
import { UseQueryResult } from '@tanstack/react-query';

import { StacksNetwork } from '@stacks/network';
import { ClarityValue, cvToHex } from '@stacks/transactions';

import { HIRO_HEADERS } from '../constants/env';
import { ReadOnlyResponse } from '../types/ReadOnlyResponse';

interface ReadOnlyOptions {
  senderAddress: string;
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
}

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
      ...HIRO_HEADERS,
    },
  });

  return response.json();
};

export function useCallReadOnlyFunction(
  {
    contractId,
    fn,
    readOnlyValue,
    stxAddress,
    stacksNetwork,
  }: { contractId: string; fn: any; readOnlyValue: any; stxAddress?: string; stacksNetwork: any },
  options: any = {}
): UseQueryResult<ReadOnlyResponse> {
  return useQuery({
    queryKey: ['readonly', contractId, fn.name],
    queryFn: () =>
      callReadOnlyFunction({
        contractName: contractId.split('.')[1],
        contractAddress: contractId.split('.')[0],
        functionName: fn.name,
        functionArgs: readOnlyValue,
        network: stacksNetwork,
        senderAddress: stxAddress!,
      }),
    staleTime: 0,
    cacheTime: 0,
    enabled: !!stxAddress,
    ...options,
  });
}
