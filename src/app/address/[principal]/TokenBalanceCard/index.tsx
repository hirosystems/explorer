'use client';

import { useMemo } from 'react';

import { cvToJSON, hexToCV } from '@stacks/transactions';

import { Section } from '../../../../common/components/Section';
import { useAccountBalance } from '../../../../common/queries/useAccountBalance';
import { useSuspenseNftHoldings } from '../../../../common/queries/useNftHoldings';
import { hexToString } from '../../../../common/utils/utils';
import { Tab } from '../../../../ui/Tab';
import { TabList } from '../../../../ui/TabList';
import { TabPanel } from '../../../../ui/TabPanel';
import { TabPanels } from '../../../../ui/TabPanels';
import { Tabs } from '../../../../ui/Tabs';
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
      <Tabs isLazy>
        <TabList>
          <Tab>Tokens</Tab>
          <Tab>Collectibles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel gap={0}>{!!balance && <FtBalance balance={balance} />}</TabPanel>
          <TabPanel gap={0}>
            {!!balance && (
              <NftBalance balance={balance} nftHoldings={nftHoldings} bnsHexValues={bnsHexValues} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Section>
  );
}

export function TokenBalanceCard(props: TokenBalanceCardProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{ title: 'Holdings', mb: '32px' }}
      tryAgainButton
    >
      <TokenBalanceCardBase {...props} />
    </ExplorerErrorBoundary>
  );
}
