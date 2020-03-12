import React from 'react';
import { Tag, Transaction } from '@components/tags';
import { Status, Statuses } from '@components/status';

import { Flex, Box, Stack } from '@blockstack/ui';

const TagComponents: React.FC = props => (
  <Box {...props}>
    <Stack spacing="loose">
      {Object.keys(Transaction).map(label => (
        <Tag type={Transaction[label as keyof typeof Transaction]} />
      ))}
    </Stack>
  </Box>
);

const StatusComponents: React.FC = props => (
  <Box {...props}>
    <Stack spacing="loose">
      {Object.keys(Statuses).map(label => (
        <Status status={Statuses[label as keyof typeof Statuses]} />
      ))}
    </Stack>
  </Box>
);

const Home: React.FC = () => (
  <Flex height="100vh" width="100%" align="center" justify="center">
    <Stack isInline>
      <TagComponents />
      <StatusComponents />
    </Stack>
  </Flex>
);

export default Home;
