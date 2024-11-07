'use client';

import { Tabs } from '@chakra-ui/react';
import { useMemo } from 'react';

import { cvToJSON, hexToCV } from '@stacks/transactions';

import { Section } from '../../../../common/components/Section';
import { useAccountBalance } from '../../../../common/queries/useAccountBalance';
import { useSuspenseNftHoldings } from '../../../../common/queries/useNftHoldings';
import { hexToString } from '../../../../common/utils/utils';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { FtBalance } from './FtBalance';
import { NftBalance } from './NftBalance';

interface TokenBalanceCardProps {
  address: string;
}

function TokenBalanceCardBase({ address, ...rest }: TokenBalanceCardProps) {
  const { data: balance } = useAccountBalance(address);
  const { data: nftHoldings } = useSuspenseNftHoldings(address, { refetchOnWindowFocus: true });
  const bnsHexValues = useMemo(
    () =>
      nftHoldings?.results
        ?.filter(nftHolding => nftHolding.asset_identifier.endsWith('.bns::names'))
        ?.reduce(
          (acc, data) => {
            acc[data.asset_identifier] = data.value?.hex
              ? {
                  name: hexToString(
                    cvToJSON(hexToCV(data.value.hex))?.value?.name?.value?.replace('0x', '')
                  ),
                  namespace: hexToString(
                    cvToJSON(hexToCV(data.value.hex))?.value?.namespace?.value?.replace('0x', '')
                  ),
                }
              : {};
            return acc;
          },
          {} as Record<string, { name?: string; namespace?: string }>
        ) || {},
    [nftHoldings]
  );

  return (
    <Section title="Holdings" {...rest}>
      <Tabs.Root lazyMount defaultValue="tokens">
        <Tabs.List>
          <Tabs.Trigger value="tokens">Tokens</Tabs.Trigger>
          <Tabs.Trigger value="collectibles">Collectibles</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tokens">{!!balance && <FtBalance balance={balance} />}</Tabs.Content>
        <Tabs.Content value="collectibles">
          {!!balance && (
            <NftBalance balance={balance} nftHoldings={nftHoldings} bnsHexValues={bnsHexValues} />
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Section>
  );
}

export function TokenBalanceCard(props: TokenBalanceCardProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{ title: 'Holdings', mb: 8 }}
      tryAgainButton
    >
      <TokenBalanceCardBase {...props} />
    </ExplorerErrorBoundary>
  );
}
