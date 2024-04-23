import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

import { AddressLink, ExplorerLink } from '../../common/components/ExplorerLinks';
import { Section } from '../../common/components/Section';
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
  <Th py={3} px={6}>
    <Flex
      bg="dropdownBgHover"
      px={2.5}
      py={2}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
      width="fit-content"
    >
      <Text
        fontWeight="medium"
        whiteSpace="nowrap"
        fontSize="xs"
        color={useColorModeValue('slate.700', 'slate.250')}
        textTransform="none"
        letterSpacing="normal"
      >
        {headerTitle}
      </Text>
    </Flex>
  </Th>
);

export const signersTableHeaders = [
  '#',
  'Signer key',
  'Associated address',
  'Voting power',
  'STX staked',
  'Last vote slot',
];

export const SignersTableHeaders = () => (
  <Tr>
    {signersTableHeaders.map((header, index) => (
      <SignersTableHeader key={`signers-table-header-${index}`} headerTitle={header} />
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
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {index}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <Show above="lg">
            <ExplorerLink>{signerKey}</ExplorerLink>
          </Show>
          <Show below="lg">
            <ExplorerLink>{truncateMiddle(signerKey)}</ExplorerLink>
          </Show>
        </Text>
      </Td>
      <Td py={3} px={6}>
        <AddressLink
          principal={associatedAddress}
          whiteSpace="nowrap"
          fontSize="sm"
          color="secondaryText"
        >
          {associatedAddress}
        </AddressLink>
      </Td>
      <Td py={3} px={6}>
        <HStack flexWrap="nowrap">
          <Box display={['none', 'none', 'none', 'block']} height="12px" width="100%">
            <ProgressBar progressPercentage={23.4} />
          </Box>
          <Text whiteSpace="nowrap" fontSize="sm" color="secondaryText">
            {votingPower}
          </Text>
        </HStack>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {stxStaked}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {lastVoteSlot}
        </Text>
      </Td>
    </Tr>
  );
};

export function SignersTableLayout({
  numSigners,
  signersTableHeaders,
  signersTableRows,
  votingPowerSortOrder,
  setVotingPowerSortOrder,
}: {
  numSigners: ReactNode;
  signersTableHeaders: ReactNode;
  signersTableRows: ReactNode;
  votingPowerSortOrder: VotingPowerSortOrder;
  setVotingPowerSortOrder: (order: VotingPowerSortOrder) => void;
}) {
  return (
    <Section
      title={numSigners}
      topRight={
        <SortByVotingPowerFilter
          setVotingPowerSortOrder={setVotingPowerSortOrder}
          votingPowerSortOrder={votingPowerSortOrder}
        />
      }
    >
      <Box overflowX={'auto'}>
        <Table width="full">
          <Thead>{signersTableHeaders}</Thead>
          <Tbody>{signersTableRows}</Tbody>
        </Table>
      </Box>
    </Section>
  );
}

const SignerTable = () => {
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1); // TODO: replace with actual data
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState(VotingPowerSortOrder.Desc);

  return (
    <SignersTableLayout
      votingPowerSortOrder={votingPowerSortOrder}
      setVotingPowerSortOrder={setVotingPowerSortOrder}
      numSigners={<Text fontWeight="medium">40 Active Signers</Text>}
      signersTableHeaders={<SignersTableHeaders />}
      signersTableRows={numRows.map((_, index) => (
        <SignerTableRow key={`signers=table-row-${index}`} index={index} {...testGridRowData} />
      ))}
    />
  );
};

export default SignerTable;
