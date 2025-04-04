import { Grid, Table } from '@chakra-ui/react';

import { ListFooter } from '../../../common/components/ListFooter';
import { TableContainer } from '../../../ui/TableContainer';
import { Text } from '../../../ui/Text';
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
      <Grid placeItems="center" px="16px" py="32px" width={'100%'} minHeight={'768px'}>
        <Text fontSize={'sm'}>No tokens found</Text>
      </Grid>
    );
  }
  return (
    <TableContainer>
      <Table.Root
        layerStyle="simple" // TODO: v3 upgrade. This might be broken
        overflowX={'auto'}
        css={{ tableLayout: 'fixed', width: 'full' }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader padding={'10px 20px 10px 16px'} width={['auto', 'auto', '30%']}>
              Token
            </Table.ColumnHeader>
            <Table.ColumnHeader padding={'10px'} display={['none', 'none', 'table-cell']}>
              Tx ID
            </Table.ColumnHeader>
            <Table.ColumnHeader width={'130px'} padding={'10px 16px 10px 20px'}>
              Total supply
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {allFtTokensDeduped.map((ftToken, i) => (
            <TokenRow ftToken={ftToken} key={ftToken.tx_id} />
          ))}
        </Table.Body>
      </Table.Root>
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
