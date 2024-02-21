import { Table } from '@/ui/Table';
import { Tbody } from '@/ui/Tbody';
import { Td } from '@/ui/Td';
import { Th } from '@/ui/Th';
import { Thead } from '@/ui/Thead';
import { Tr } from '@/ui/Tr';
import { Text } from '@chakra-ui/react';
import { useState } from 'react';

import { Card } from '../../common/components/Card';
import { truncateMiddle } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Show } from '../../ui/Show';
import { ProgressBar } from './ProgressBar';
import { SortByVotingPowerFilter, VotingPowerSortOrder } from './SortByVotingPowerFilter';

const TableHeaderItem = ({ headerTitle }: { headerTitle: string }) => (
  <Th padding="24px 12px">
    <Flex
      bg="dropdownBgHover"
      padding="8px 10px"
      borderRadius="6px"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontWeight="medium" whiteSpace="nowrap" fontSize="xs" color="textOnGrayBg">
        {headerTitle}
      </Text>
    </Flex>
  </Th>
);

const gridHeaders = [
  '#',
  'Signer key',
  'Asociated address',
  'Voting power',
  'STX staked',
  'Last vote slot',
];

const TableHeaders = () => (
  <Tr>
    {gridHeaders.map((header, index) => (
      <TableHeaderItem key={index} headerTitle={header} />
    ))}
  </Tr>
);

const TestTableRows = () => {
  const testGridRowData = {
    signerKey: 'CW9C7HBwAMgqNdXW9W9C7HB2w',
    associatedAddress: 'ST2M...73ZG',
    votingPower: '23.4%',
    stxStaked: '1,878,325',
    lastVoteSlot: '24525621 (-1)',
  };
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <>
      {numRows.map((num, index) => (
        <Tr key={index}>
          <Td padding="24px 12px" textAlign="center">
            <Text whiteSpace="nowrap" fontSize="sm">
              {num}
            </Text>
          </Td>
          <Td padding="24px 12px">
            <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              <Show above="lg">
                <Text>{testGridRowData.signerKey}</Text>
              </Show>
              <Show below="lg">
                <Text>{truncateMiddle(testGridRowData.signerKey)}</Text>
              </Show>
            </Text>
          </Td>
          <Td padding="24px 12px">
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.associatedAddress}
            </Text>
          </Td>
          <Td padding="24px 12px">
            <HStack flexWrap="nowrap">
              <Box display={['none', 'none', 'none', 'block']} height="12px" width="100%">
                <ProgressBar progressPercentage={23.4} height="12px" />
              </Box>
              <Text whiteSpace="nowrap" fontSize="sm" color="secondaryText">
                {testGridRowData.votingPower}
              </Text>
            </HStack>
          </Td>
          <Td padding="24px 12px">
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.stxStaked}
            </Text>
          </Td>
          <Td padding="24px 12px">
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.lastVoteSlot}
            </Text>
          </Td>
        </Tr>
      ))}
    </>
  );
};

const SignerTable = () => {
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState(VotingPowerSortOrder.Desc);

  return (
    <Card width="full">
      <Flex
        p="12px 28px"
        borderBottom="1px solid var(--stacks-colors-border)"
        flexDirection={['column', 'column', 'row', 'row']}
        justifyContent={['center', 'center', 'space-between', 'space-between']}
        alignItems={['flex-start', 'flex-start', 'center', 'center']}
        gap={[5, 5, 0, 0]}
      >
        <Text fontWeight="medium">40 Active Signers</Text>
        <SortByVotingPowerFilter
          votingPowerSortOrder={votingPowerSortOrder}
          setVotingPowerSortOrder={setVotingPowerSortOrder}
        />
      </Flex>
      <Box overflowX="auto" width="full">
        <Table
          width="full"
          sx={{
            td: { borderColor: 'border' },
            th: { borderBottom: 'none' },
            'th:first-of-type': {
              borderRight: [
                '2px solid var(--stacks-colors-border)',
                '2px solid var(--stacks-colors-border)',
                'none',
                'none',
              ],
            },
            'tr > td:first-of-type': {
              borderRight: [
                '2px solid var(--stacks-colors-border)',
                '2px solid var(--stacks-colors-border)',
                'none',
                'none',
              ],
            },
          }}
        >
          <Thead>
            <TableHeaders />
          </Thead>
          <Tbody>
            <TestTableRows />
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};

export default SignerTable;
