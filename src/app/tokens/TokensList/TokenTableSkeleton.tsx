'use client';

import { Table } from '../../../ui/Table';
import { TableContainer } from '../../../ui/TableContainer';
import { Tbody } from '../../../ui/Tbody';
import { Th } from '../../../ui/Th';
import { Thead } from '../../../ui/Thead';
import { Tr } from '../../../ui/Tr';
import { Loading as TokenRowLoading } from '../TokenRow/loading';

export function TokenTableSkeleton() {
  return (
    <TableContainer>
      <Table
        css={{ tableLayout: 'fixed', width: 'full' }}
        // TODO: v3 upgrade. This might be broken
      >
        <Thead>
          <Tr>
            <Th padding={'10px 20px 10px 16px'} width={['auto', 'auto', '30%']}>
              Token
            </Th>
            <Th padding={'10px'} display={['none', 'none', 'table-cell']}>
              Tx ID
            </Th>
            <Th width={'130px'} padding={'10px 16px 10px 20px'}>
              Total supply
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {Array.from({ length: 30 }).map((_, index) => (
            <TokenRowLoading key={index} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
