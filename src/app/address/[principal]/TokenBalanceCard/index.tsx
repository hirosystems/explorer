'use client';

import { Tabs } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Section } from '../../../../common/components/Section';
import { useGlobalContext } from '../../../../common/context/useGlobalContext';
import { useAccountBalance } from '../../../../common/queries/useAccountBalance';
import { useSuspenseNftHoldings } from '../../../../common/queries/useNftHoldings';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { FtBalance } from './FtBalance';
import { NftBalance } from './NftBalance';
import { useBnsNames } from './useBnsNames';

interface TokenBalanceCardProps {
  address: string;
}

function TokenBalanceCardBase({ address, ...rest }: TokenBalanceCardProps) {
  const { data: balance } = useAccountBalance(address);
  const { data: nftHoldings } = useSuspenseNftHoldings(address, { refetchOnWindowFocus: true });
  const { activeNetwork } = useGlobalContext();

  const { bnsNames } = useBnsNames(nftHoldings, activeNetwork.mode);

  if (!balance) return null;

  return (
    <Section title={'Holdings'} {...rest}>
      <Tabs.Root lazyMount defaultValue="tokens">
        <Tabs.List>
          <Tabs.Trigger value="tokens">Tokens</Tabs.Trigger>
          <Tabs.Trigger value="collectibles">Collectibles</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tokens">{!!balance && <FtBalance balance={balance} />}</Tabs.Content>
        <Tabs.Content value="collectibles">
          {!!balance && (
            <NftBalance balance={balance} nftHoldings={nftHoldings} bnsHexValues={bnsNames} />
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
