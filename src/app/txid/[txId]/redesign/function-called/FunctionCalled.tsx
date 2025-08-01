import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { isConfirmedTx } from '@/common/utils/transactions';
import { DefaultBadge, DefaultBadgeLabel } from '@/ui/Badge';
import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { Box, Flex, Grid, Stack } from '@chakra-ui/react';
import { Function } from '@phosphor-icons/react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

import { TabsContentContainer } from '../TxTabs';
import { FunctionArgsTable } from './FunctionArgsTable';
import { FunctionResultNonTuple } from './FunctionResultNonTuple';
import { FunctionResultStatus } from './FunctionResultStatus';
import { FunctionResultsTable } from './FunctionResultTable';
import { FunctionResultType } from './FunctionResultType';
import { getContractCallTxFunctionArgs } from './utils';

function FunctionTitle({ tx }: { tx: ContractCallTransaction | MempoolContractCallTransaction }) {
  const contractCallName = tx.contract_call?.function_name;
  return (
    <TabsContentContainer>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Flex gap={2} alignItems={'center'}>
          <DefaultBadge
            label={<DefaultBadgeLabel label={contractCallName} />}
            icon={<Function />}
            variant="solid"
          />
          <CopyButtonRedesign
            initialValue={contractCallName}
            buttonProps={{
              p: 1.5,
            }}
            iconProps={{
              h: 3.5,
              w: 3.5,
            }}
          />
        </Flex>
        <ButtonLink
          href={'#'} // TODO: use the right link
          buttonLinkSize="small"
          aria-label="Call this function"
        >
          Call this function
        </ButtonLink>
      </Flex>
    </TabsContentContainer>
  );
}

function FunctionResult({ tx }: { tx: ContractCallTransaction | MempoolContractCallTransaction }) {
  if (!isConfirmedTx(tx) || !tx.tx_result) return null;
  const result = tx.tx_result;
  const { success, type, value } = cvToJSON(hexToCV(result.hex));
  const hasType = !type?.includes('UnknownType');

  return (
    <TabsContentContainer px={6}>
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', md: 'auto minmax(0, 1fr)' }}
        gap={3}
        columnGap={12}
      >
        {type?.includes('tuple') ? (
          <>
            <Box pt={4}>
              <Text textStyle="text-medium-sm" color="textSecondary">
                Result
              </Text>
            </Box>
            <Stack alignItems="flex-start">
              <FunctionResultType tx={tx} />
              <FunctionResultsTable tx={tx} />
            </Stack>
          </>
        ) : (
          <>
            <Text textStyle="text-medium-sm" color="textSecondary">
              Result
            </Text>
            <Flex alignItems="center" gap={2}>
              <FunctionResultStatus tx={tx} />
              <FunctionResultNonTuple tx={tx} />
            </Flex>
          </>
        )}
      </Grid>
    </TabsContentContainer>
  );
}

function FunctionArgs({ tx }: { tx: ContractCallTransaction | MempoolContractCallTransaction }) {
  const args = getContractCallTxFunctionArgs(tx);
  if (!args.length) return null;
  return (
    <TabsContentContainer px={6}>
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', md: 'auto minmax(0, 1fr)' }}
        gap={3}
        columnGap={12}
      >
        <Box pt={5}>
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
      <FunctionTitle tx={tx} />
      <FunctionResult tx={tx} />
      <FunctionArgs tx={tx} />
    </Stack>
  );
};
