import { Box, Flex, Table } from '@chakra-ui/react';
import { FC } from 'react';

import { Skeleton } from '../../../ui/Skeleton';

export const Loading: FC = () => {
  return (
    <Table.Row>
      <Table.Cell padding={'10px 20px 10px 16px'} width={['auto', 'auto', '30%']}>
        <Flex alignItems={'center'} gap={'8px'}>
          <Skeleton width={'36px'} height={'36px'} />
          <Box width={'100%'} maxWidth={'120px'}>
            <Skeleton height={'15px'} />
          </Box>
        </Flex>
      </Table.Cell>
      <Table.Cell padding={'10px'} display={['none', 'none', 'table-cell']}>
        <Box maxWidth={'500px'}>
          <Skeleton height={'15px'} />
        </Box>
      </Table.Cell>
      <Table.Cell width={'130px'} padding={'10px 16px 10px 20px'}>
        <Box maxWidth={'70px'} marginLeft={'auto'}>
          <Skeleton height={'15px'} />
        </Box>
      </Table.Cell>
    </Table.Row>
  );
};
