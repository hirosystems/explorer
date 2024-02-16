import { Grid, GridItem, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { Card } from '../../common/components/Card';
import { Flex } from '../../ui/Flex';
import { SortByVotingPowerFilter, VotingPowerSortOrder } from './SortByVotingPowerFilter';

const GridHeaderItem = ({ headerTitle }: { headerTitle: string }) => {
  return (
    <GridItem colSpan={1} p={4}>
      <Flex
        bg="border"
        padding="8px 10px"
        borderRadius="6px"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontWeight="medium" whiteSpace="nowrap" fontSize="xs" color="slate.800">
          {headerTitle}
        </Text>
      </Flex>
    </GridItem>
  );
};

const gridHeaders = [
  '#',
  'Signer key',
  'Asociated address',
  'Voting power',
  'STX staked',
  'Last vote slot',
];

const GridHeaders = () => {
  return (
    <>
      {gridHeaders.map(header => (
        <GridHeaderItem headerTitle={header} />
      ))}
    </>
  );
};

const TestGridRows = () => {
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
      {numRows.map(num => (
        <>
          <GridItem colSpan={1} p={4}>
            <Flex justifyContent="center" alignItems="center">
              <Text whiteSpace="nowrap" fontSize="sm">
                {num}
              </Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={1} p={4}>
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.signerKey}
            </Text>
          </GridItem>
          <GridItem colSpan={1} p={4}>
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.associatedAddress}
            </Text>
          </GridItem>
          <GridItem colSpan={1} p={4}>
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.votingPower}
            </Text>
          </GridItem>
          <GridItem colSpan={1} p={4}>
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.stxStaked}
            </Text>
          </GridItem>
          <GridItem colSpan={1} p={4}>
            <Text whiteSpace="nowrap" fontSize="sm">
              {testGridRowData.lastVoteSlot}
            </Text>
          </GridItem>
        </>
      ))}
    </>
  );
};

const SignerGrid = () => {
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState<VotingPowerSortOrder>(
    VotingPowerSortOrder.Desc
  );

  return (
    <Card width="full">
      <Flex
        p="12px 28px"
        borderBottom="1px solid var(--stacks-colors-border)"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontWeight="medium">40 Active Signers</Text>
        <SortByVotingPowerFilter
          votingPowerSortOrder={votingPowerSortOrder}
          setVotingPowerSortOrder={setVotingPowerSortOrder}
        />
      </Flex>
      <Grid
        templateColumns="repeat(6, auto)"
        gap={4}
        width="full"
        p="28px"
      >
        <GridHeaders />
        <TestGridRows />
      </Grid>
    </Card>
  );
};

export default SignerGrid;
