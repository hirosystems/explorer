import { DefaultBadge, DefaultBadgeLabel } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Grid, Stack } from '@chakra-ui/react';
import { Function } from '@phosphor-icons/react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TabsContentContainer } from '../TxTabs';
import { FunctionArgsTable } from './FunctionArgsTable';
import { FunctionResultsTable } from './FunctionResultsTable';

export const FunctionCalled = ({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) => {
  console.log('FunctionCalled', { tx });
  return (
    <Stack gap={2}>
      <TabsContentContainer>
        <DefaultBadge
          label={<DefaultBadgeLabel label="Function called" />}
          icon={<Function />}
          variant="solid"
        />
      </TabsContentContainer>
      <TabsContentContainer>
        <Grid templateColumns="auto 1fr" gap={12} columnGap={12}>
          <Text textStyle="text-medium-sm" color="textSecondary">
            Result
          </Text>
          <FunctionResultsTable tx={tx} />
        </Grid>
      </TabsContentContainer>
      <TabsContentContainer>
        <Grid templateColumns="auto 1fr" gap={12} columnGap={12}>
          <Text textStyle="text-medium-sm" color="textSecondary">
            Arguments
          </Text>
          <FunctionArgsTable tx={tx} />
        </Grid>
      </TabsContentContainer>
    </Stack>
  );
};
