import * as React from 'react';

import { ListFooter } from '../../../common/components/ListFooter';
import { Grid } from '../../../ui/Grid';
import { Table } from '../../../ui/Table';
import { TableContainer } from '../../../ui/TableContainer';
import { Tbody } from '../../../ui/Tbody';
import { Text } from '../../../ui/Text';
import { Th } from '../../../ui/Th';
import { Thead } from '../../../ui/Thead';
import { Tr } from '../../../ui/Tr';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
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
      <Grid placeItems="center" px="16px" py="32px" width={'100%'} minHeight={'container.md'}>
        <Text fontSize={'sm'}>No tokens found</Text>
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
            (ftToken, i) => !!ftToken.name && <TokenRow ftToken={ftToken} key={ftToken.tx_id} />
          )}
        </Tbody>
      </Table>
      <ListFooter
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
