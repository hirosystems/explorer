import React from 'react';
import { Tag, Transaction } from '@components/tags';
import { Flex, Stack } from '@blockstack/ui';

const Home: React.FC = () => (
  <Flex height="100vh" width="100%" align="center" justify="center">
    <Stack spacing="loose">
      {Object.keys(Transaction).map(label => (
        <Tag type={Transaction[label as keyof typeof Transaction]} />
      ))}
    </Stack>
  </Flex>
);

export default Home;
