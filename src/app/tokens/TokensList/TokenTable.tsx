import * as React from 'react';

import { SectionFooterActions } from '../../../common/components/SectionFooterActions';
import { Grid } from '../../../ui/Grid';
import { Table } from '../../../ui/Table';
import { TableContainer } from '../../../ui/TableContainer';
import { Tbody } from '../../../ui/Tbody';
import { Text } from '../../../ui/Text';
import { Th } from '../../../ui/Th';
import { Thead } from '../../../ui/Thead';
import { Tr } from '../../../ui/Tr';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { TokenTabsBase } from '../../token/[tokenId]/Tabs';
import { TokenRow } from '../TokenRow';
import { useSuspenseTokens } from '../useTokens';

interface TokenTableBaseProps {
  debouncedSearchTerm: string;
}

function TokenTableBase({ debouncedSearchTerm }: TokenTableBaseProps) {
  const { allFtTokensDeduped, isLoading, hasMore, loadMore } =
    useSuspenseTokens(debouncedSearchTerm);
  if (!allFtTokensDeduped.length) {
    return (
      <Grid placeItems="center" px="16px" py="32px" width={'100%'}>
        <Text color={'textCaption'} mt="32px">
          No tokens found
        </Text>
      </Grid>
    );
  }
  return (
    <TableContainer>
      <Table variant="simple" overflowX={'auto'} __css={{ tableLayout: 'fixed', width: 'full' }}>
        <Thead>
          <Tr>
            <Th padding={'10px 20px 10px 16px'} width={['auto', 'auto', '30%']}>
              Token
            </Th>
            <Th padding={'10px'} display={['none', 'none', 'table-cell']}>
              Tx ID
            </Th>
            <Th isNumeric width={'130px'} padding={'10px 16px 10px 20px'}>
              Total supply
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {allFtTokensDeduped.map(
            (ftToken, i) =>
              !!ftToken.name && (
                <TokenRow
                  key={ftToken.tx_id}
                  name={ftToken.name}
                  txId={ftToken.tx_id}
                  symbol={ftToken.symbol}
                  totalSupply={ftToken.total_supply}
                  imgUrl={ftToken.image_uri}
                  tokenId={(ftToken as any).contract_principal}
                />
              )
          )}
        </Tbody>
      </Table>
      <SectionFooterActions
        isLoading={isLoading}
        hasNextPage={hasMore}
        fetchNextPage={loadMore}
        label={'tokens'}
      />
    </TableContainer>
  );
}

export function TokenTable(props: TokenTableBaseProps) {
  return (
    <ExplorerErrorBoundary tryAgainButton>
      <TokenTableBase {...props} />
    </ExplorerErrorBoundary>
  );
}
