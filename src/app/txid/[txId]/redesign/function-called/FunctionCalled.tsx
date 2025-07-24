import { isConfirmedTx } from '@/common/utils/transactions';
import { DefaultBadge, DefaultBadgeLabel } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Box, Grid, Stack } from '@chakra-ui/react';
import { Function } from '@phosphor-icons/react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TabsContentContainer } from '../TxTabs';
import { FunctionArgsTable } from './FunctionArgsTable';
import { FunctionResultType } from './FunctionResultType';
import { FunctionResultsTable } from './FunctionResultsTable';

function FunctionTitle() {
  return (
    <TabsContentContainer>
      <DefaultBadge
        label={<DefaultBadgeLabel label="Function called" />}
        icon={<Function />}
        variant="solid"
      />
    </TabsContentContainer>
  );
}

function FunctionResult({ tx }: { tx: ContractCallTransaction | MempoolContractCallTransaction }) {
  if (!isConfirmedTx(tx)) return null;
  return (
    <TabsContentContainer px={6}>
      <Grid templateColumns="auto 1fr" gap={12} columnGap={12}>
        <Box pt={4}>
          <Text textStyle="text-medium-sm" color="textSecondary">
            Result
          </Text>
        </Box>
        <Stack>
          <FunctionResultType tx={tx} />
          <FunctionResultsTable tx={tx} />
        </Stack>
      </Grid>
    </TabsContentContainer>
  );
}

function FunctionArgs({ tx }: { tx: ContractCallTransaction | MempoolContractCallTransaction }) {
  return (
    <TabsContentContainer px={6}>
      <Grid templateColumns="auto 1fr" gap={12} columnGap={12}>
        <Box pt={3}>
          <Text textStyle="text-medium-sm" color="textSecondary">
            Arguments
          </Text>
        </Box>
        <FunctionArgsTable tx={tx} />
      </Grid>
    </TabsContentContainer>
  );
}

export const FunctionCalled = ({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) => {
  return (
    <Stack gap={2}>
      <FunctionTitle />
      <FunctionResult tx={tx} />
      <FunctionArgs tx={tx} />
    </Stack>
  );
};
