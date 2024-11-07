'use client';

import { Table } from '@chakra-ui/react';

import { TableContainer } from '../../../ui/TableContainer';
import { Loading as TokenRowLoading } from '../TokenRow/loading';

export function TokenTableSkeleton() {
  return (
    <TableContainer>
      <Table.Root css={{ tableLayout: 'fixed', width: 'full' }}>
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
          {Array.from({ length: 30 }).map((_, index) => (
            <TokenRowLoading key={index} />
          ))}
        </Table.Body>
      </Table.Root>
    </TableContainer>
  );
}
