import React from 'react';

import { Button, Box, Stack } from '@blockstack/ui';
import { Title, Text } from '@components/typography';
import { Meta } from '@components/meta-head';
import { useProgressBar } from '@components/progress-bar';

export const TxNotFound = ({ refresh }: { refresh: () => Promise<any> }) => {
  const [loading, setLoading] = React.useState(false);
  const { start, done } = useProgressBar();
  const handleRefresh = async () => {
    setLoading(true);
    start();
    setTimeout(async () => {
      await refresh();
      setLoading(false);
      done();
    }, 3500);
  };
  return (
    <>
      <Meta title="Transaction not found" />
      <Title as="h1" textStyle="display.large" fontSize="36px">
        Transaction not found!
      </Title>
      <Stack spacing="base">
        <Text maxWidth="650px" display="block" mt="base">
          There is no record of a transaction with this ID. Transactions can take 60 or more seconds
          to confirm. If the you know the transaction was recently broadcast, feel free to refresh.
        </Text>
        <Box>
          <Button onClick={handleRefresh} isLoading={loading}>
            Refresh
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default TxNotFound;
