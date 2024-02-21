import { ReactNode, useState } from 'react';

import { Card } from '../../common/components/Card';
import { truncateMiddle } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Show } from '../../ui/Show';
import { Table } from '../../ui/Table';
import { Tbody } from '../../ui/Tbody';
import { Td } from '../../ui/Td';
import { Text } from '../../ui/Text';
import { Th } from '../../ui/Th';
import { Thead } from '../../ui/Thead';
import { Tr } from '../../ui/Tr';
import { ProgressBar } from './ProgressBar';
import { SortByVotingPowerFilter, VotingPowerSortOrder } from './SortByVotingPowerFilter';

export const SignersTableHeader = ({ headerTitle }: { headerTitle: string }) => (
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

export const signersTableHeaders = [
  '#',
  'Signer key',
  'Asociated address',
  'Voting power',
  'STX staked',
  'Last vote slot',
];

export const SignersTableHeaders = () => (
  <Tr>
    {signersTableHeaders.map((header, index) => (
      <SignersTableHeader key={index} headerTitle={header} />
    ))}
  </Tr>
);

const testGridRowData = {
  // TODO: replace with actual data
  signerKey: 'CW9C7HBwAMgqNdXW9W9C7HB2w',
  associatedAddress: 'ST2M...73ZG',
  votingPower: '23.4%',
  stxStaked: '1,878,325',
  lastVoteSlot: '24525621 (-1)',
};

const SignerTableRow = ({
  index,
  signerKey,
  associatedAddress,
  votingPower,
  stxStaked,
  lastVoteSlot,
}: {
  index: number;
  signerKey: string;
  associatedAddress: string;
  votingPower: string;
  stxStaked: string;
  lastVoteSlot: string;
}) => {
  return (
    <Tr>
      <Td padding="24px 12px" textAlign="center">
        <Text whiteSpace="nowrap" fontSize="sm">
          {index}
        </Text>
      </Td>
      <Td padding="24px 12px">
        <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <Show above="lg">
            <Text>{signerKey}</Text>
          </Show>
          <Show below="lg">
            <Text>{truncateMiddle(signerKey)}</Text>
          </Show>
        </Text>
      </Td>
      <Td padding="24px 12px">
        <Text whiteSpace="nowrap" fontSize="sm">
          {associatedAddress}
        </Text>
      </Td>
      <Td padding="24px 12px">
        <HStack flexWrap="nowrap">
          <Box display={['none', 'none', 'none', 'block']} height="12px" width="100%">
            <ProgressBar progressPercentage={23.4} height="12px" />
          </Box>
          <Text whiteSpace="nowrap" fontSize="sm" color="secondaryText">
            {votingPower}
          </Text>
        </HStack>
      </Td>
      <Td padding="24px 12px">
        <Text whiteSpace="nowrap" fontSize="sm">
          {stxStaked}
        </Text>
      </Td>
      <Td padding="24px 12px">
        <Text whiteSpace="nowrap" fontSize="sm">
          {lastVoteSlot}
        </Text>
      </Td>
    </Tr>
  );
};

export function SignersTableLayout({
  numSigners,
  votingPowerSortDrodpown,
  signersTableHeaders,
  signersTableRows,
}: {
  numSigners: ReactNode;
  votingPowerSortDrodpown: ReactNode;
  signersTableHeaders: ReactNode;
  signersTableRows: ReactNode;
}) {
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
        {numSigners}
        {votingPowerSortDrodpown}
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
          <Thead>{signersTableHeaders}</Thead>
          <Tbody>{signersTableRows}</Tbody>
        </Table>
      </Box>
    </Card>
  );
}

const SignerTable = () => {
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState(VotingPowerSortOrder.Desc);
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1); // TODO: replace with actual data

  return (
    <SignersTableLayout
      numSigners={<Text fontWeight="medium">40 Active Signers</Text>}
      votingPowerSortDrodpown={
        <SortByVotingPowerFilter
          setVotingPowerSortOrder={setVotingPowerSortOrder}
          votingPowerSortOrder={votingPowerSortOrder}
        />
      }
      signersTableHeaders={<SignersTableHeaders />}
      signersTableRows={numRows.map((_, index) => (
        <SignerTableRow key={index} index={index} {...testGridRowData} />
      ))}
    />
  );
};

export default SignerTable;
