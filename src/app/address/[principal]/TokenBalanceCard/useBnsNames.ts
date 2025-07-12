import { NetworkModes } from '@/common/types/network';
import { getBnsFromId, getNameInfo } from 'bns-v2-sdk';
import { useEffect, useState } from 'react';

import { NonFungibleTokenHoldingsList } from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

import { BNSV1_CONTRACT, BNSV2_CONTRACT } from '../../../../common/constants/constants';
import { hexToString } from '../../../../common/utils/utils';

interface BnsNameInfo {
  name: string;
  namespace: string;
}

export function useBnsNames(
  nftHoldings?: NonFungibleTokenHoldingsList,
  network: NetworkModes = NetworkModes.Mainnet
) {
  const [bnsNames, setBnsNames] = useState<Record<string, BnsNameInfo>>({});

  useEffect(() => {
    async function resolveBnsNames() {
      if (!nftHoldings?.results) {
        setBnsNames({});
        return;
      }

      const bnsHoldings = nftHoldings.results.filter(
        nftHolding =>
          nftHolding.asset_identifier === BNSV1_CONTRACT ||
          nftHolding.asset_identifier === BNSV2_CONTRACT
      );

      if (bnsHoldings.length === 0) {
        setBnsNames({});
        return;
      }

      const resolved: Record<string, BnsNameInfo> = {};

      try {
        await Promise.allSettled(
          bnsHoldings.map(async holding => {
            try {
              const decodedValue = cvToJSON(hexToCV(holding.value.hex));

              if (holding.asset_identifier === BNSV1_CONTRACT) {
                const nameInfo = await resolveBnsV1Name(decodedValue, network);
                if (nameInfo) {
                  resolved[holding.asset_identifier] = nameInfo;
                }
              } else if (holding.asset_identifier === BNSV2_CONTRACT) {
                const nameInfo = await resolveBnsV2Name(decodedValue, network);
                if (nameInfo) {
                  resolved[holding.asset_identifier] = nameInfo;
                }
              }
            } catch (error) {
              console.warn('Failed to decode BNS holding:', holding.value.hex, error);
            }
          })
        );
      } catch {
        setBnsNames({});
      }

      setBnsNames(resolved);
    }

    resolveBnsNames();
  }, [nftHoldings, network]);

  return { bnsNames };
}

async function resolveBnsV1Name(
  decodedValue: any,
  network: NetworkModes
): Promise<BnsNameInfo | null> {
  const nameData = decodedValue.value || decodedValue;

  if (!nameData.name || !nameData.namespace) {
    return null;
  }

  const nameHex = nameData.name.value.replace(/^0x/, '');
  const namespaceHex = nameData.namespace.value.replace(/^0x/, '');

  const name = hexToString(nameHex);
  const namespace = hexToString(namespaceHex);

  return { name, namespace };
}

async function resolveBnsV2Name(
  decodedValue: any,
  network: NetworkModes
): Promise<BnsNameInfo | null> {
  if (decodedValue.type !== 'uint') {
    return null;
  }

  const tokenId = BigInt(decodedValue.value);

  try {
    const bnsInfo = await getBnsFromId({
      id: tokenId,
      network,
    });

    if (bnsInfo?.name && bnsInfo?.namespace) {
      return {
        name: bnsInfo.name,
        namespace: bnsInfo.namespace,
      };
    }
  } catch (error) {
    return null;
  }

  return null;
}
