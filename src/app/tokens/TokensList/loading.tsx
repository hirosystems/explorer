import { InputGroup } from '@/ui/InputGroup';
import { InputRightElement } from '@/ui/InputRightElement';
import { Icon } from '@/ui/Icon';
import { TbSearch } from 'react-icons/tb';
import { TableContainer } from '@/ui/TableContainer';
import { Table } from '@/ui/Table';
import { Thead } from '@/ui/Thead';
import { Tr } from '@/ui/Tr';
import { Th } from '@/ui/Th';
import { Tbody } from '@/ui/Tbody';
import { Section } from '@/components/section';
import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';
import { FC } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { Loading as TokenRowLoading } from '../TokenRow/loading';
import { Show } from '@/ui/components';

export const Loading: FC = () => {
  const colorMode = useColorMode().colorMode;
  return (
    <Section
      title={'Tokens'}
      gridColumnStart={['1', '1', '2']}
      gridColumnEnd={['2', '2', '3']}
      minWidth={0}
      topRight={
        <InputGroup>
          <InputRightElement pointerEvents="none">
            <Icon as={TbSearch} color={`textCaption.${colorMode}`} />
          </InputRightElement>
          <ExplorerSkeletonLoader width={'200px'} height={'40px'} />
        </InputGroup>
      }
    >
      <TableContainer>
        <Table variant="simple" __css={{ tableLayout: 'fixed', width: 'full' }}>
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
            {Array.from({ length: 30 }).map((_, index) => (
              <TokenRowLoading key={index} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Section>
  );
};
