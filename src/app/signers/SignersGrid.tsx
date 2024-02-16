import React from 'react';
import { Grid, GridItem, Box, Text } from '@chakra-ui/react';

const SignerGrid = () => {
  return (
    <Grid
      templateColumns="repeat(5, 1fr)" // Defines the number of columns
      gap={4}
    >
      {/* Define the header row */}
      <GridItem colSpan={5} bg="gray.100" p={4}>
        <Text>40 Active Signers</Text>
      </GridItem>

      {/* Repeat this structure for each row of data */}
      {data.map((signer, index) => (
        <>
          <GridItem colSpan={1} bg="purple.100" p={4}>
            <Text>{signer.key}</Text>
          </GridItem>
          <GridItem colSpan={1} bg="purple.100" p={4}>
            <Text>{signer.address}</Text>
          </GridItem>
          <GridItem colSpan={1} bg="purple.100" p={4}>
            <Text>{signer.votingPower}</Text>
          </GridItem>
          <GridItem colSpan={1} bg="purple.100" p={4}>
            <Text>{signer.stxStacked}</Text>
          </GridItem>
          <GridItem colSpan={1} bg="purple.100" p={4}>
            <Text>{signer.lastVoteSlot}</Text>
          </GridItem>
        </>
      ))}
    </Grid>
  );
};

export default MyGrid;
