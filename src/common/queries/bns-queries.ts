import { bufferCVFromString, cvToHex, tupleCV } from '@stacks/transactions';

import { BNSV1_CONTRACT } from '../constants/constants';
import { GenericResponseType } from '../hooks/useInfiniteQueryResult';

interface NftHistory {
  sender: string;
  recipient: string;
  event_index: number;
  asset_event_type: string;
  tx_id: string;
}

export function parseBnsAddressFromBnsNftHistory(nftHistory: NftHistory[]) {
  if (nftHistory?.length) {
    return nftHistory[0].recipient;
  }
  return null;
}

export async function fetchNftHistory(
  apiUrl: string,
  assetIdentifier: string,
  value: string
): Promise<GenericResponseType<NftHistory>> {
  const params = new URLSearchParams({
    asset_identifier: assetIdentifier,
    value,
    tx_metadata: 'false',
  });
  const fetchUrl = `${apiUrl}/extended/v1/tokens/nft/history?${params.toString()}`;
  const response = await fetch(fetchUrl, {
    next: {
      revalidate: 60, // nextjs caches the response for 60s
    },
  });

  const nftHistory = await response.json();

  return nftHistory as GenericResponseType<NftHistory>;
}

export async function fetchBnsHistory(
  apiUrl: string,
  bnsName: string
): Promise<GenericResponseType<NftHistory>> {
  const bnsNftHistory = await fetchNftHistory(
    apiUrl,
    BNSV1_CONTRACT,
    cvToHex(
      tupleCV({
        ['name']: bufferCVFromString(bnsName.replace(new RegExp('.btc$'), '')),
        ['namespace']: bufferCVFromString('btc'),
      })
    )
  );

  return bnsNftHistory;
}

export async function fetchBnsAddress(apiUrl: string, bnsName: string): Promise<string | null> {
  try {
    const bnsNftHistory = await fetchBnsHistory(apiUrl, bnsName);
    const latestBnsNftHistoryEvent = bnsNftHistory.results[0];
    const bnsAddress = parseBnsAddressFromBnsNftHistory([latestBnsNftHistoryEvent]);
    if (bnsAddress) {
      return bnsAddress;
    }
    return null;
  } catch (e) {
    return null;
  }
}
