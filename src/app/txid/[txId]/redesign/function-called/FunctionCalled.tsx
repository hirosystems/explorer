import { useUser } from '@/app/sandbox/hooks/useUser';
import { SectionTabsContentContainer } from '@/common/components/SectionTabs';
import { useContractById } from '@/common/queries/useContractById';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Box, Flex, Grid, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import { ClarityAbiFunction } from '@stacks/transactions';

import { isConfirmedTxDetails } from '../../tx-details-utils';
import { FunctionArgsTable } from './FunctionArgsTable';
import { FunctionCallForm } from './FunctionCallForm';
import { FunctionListItem } from './FunctionListItem';
import { FUNCTION_RESULT_LABEL_ID, FunctionResultPretty } from './FunctionResultPretty';
import { FunctionResultStatus } from './FunctionResultStatus';
import { getContractCallTxFunctionArgs, prettyFunctionResult } from './utils';

function FunctionTitle({
  fnAbi,
  setIsFunctionCallOpen,
  isFunctionCallOpen,
}: {
  fnAbi: ClarityAbiFunction;
  setIsFunctionCallOpen: (open: boolean) => void;
  isFunctionCallOpen: boolean;
}) {
  return (
    <SectionTabsContentContainer>
      <FunctionListItem
        functionAbi={fnAbi}
        isOpen={isFunctionCallOpen}
        setIsOpen={setIsFunctionCallOpen}
      />
    </SectionTabsContentContainer>
  );
}

function FunctionResult({ tx }: { tx: TxDetailsOf<'contract_call'> }) {
  if (!isConfirmedTxDetails(tx) || !tx.result) return null;
  const { display, success } = prettyFunctionResult(tx.result.hex);

  return (
    <SectionTabsContentContainer px={6}>
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', md: '80px minmax(0, 1fr)' }}
        gap={3}
        columnGap={12}
        alignItems="start"
      >
        <Box pt={2}>
          <Text id={FUNCTION_RESULT_LABEL_ID} textStyle="text-medium-sm" color="textSecondary">
            Result
          </Text>
        </Box>
        <Stack alignItems="stretch" gap={2} minW={0}>
          <FunctionResultStatus success={success} />
          <FunctionResultPretty display={display} />
        </Stack>
      </Grid>
    </SectionTabsContentContainer>
  );
}

function FunctionArgs({
  tx,
  functionAbi,
}: {
  tx: TxDetailsOf<'contract_call'>;
  functionAbi?: ClarityAbiFunction;
}) {
  const args = getContractCallTxFunctionArgs(tx, functionAbi);
  if (!args.length) return null;
  return (
    <SectionTabsContentContainer px={6}>
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', md: '80px minmax(0, 1fr)' }}
        gap={3}
        columnGap={12}
      >
        <Box pt={5}>
          <Text textStyle="text-medium-sm" color="textSecondary">
            Arguments
          </Text>
        </Box>
        <FunctionArgsTable tx={tx} functionAbi={functionAbi} />
      </Grid>
    </SectionTabsContentContainer>
  );
}

export const FunctionCalled = ({ tx }: { tx: TxDetailsOf<'contract_call'> }) => {
  const [isFunctionCallOpen, setIsFunctionCallOpen] = useState(false);
  const contractCallName = tx.contract_call?.function_name;
  const contractId = tx.contract_call?.contract_id;
  const { data: contract } = useContractById(contractId);
  const functionAbi = contract?.abi?.functions?.find(
    fn => fn.name === contractCallName
  ) as unknown as ClarityAbiFunction;
  const { isConnected, connect } = useUser();

  if (!contract) return null;

  return (
    <Stack gap={2}>
      <FunctionTitle
        fnAbi={functionAbi}
        setIsFunctionCallOpen={setIsFunctionCallOpen}
        isFunctionCallOpen={isFunctionCallOpen}
      />
      {isFunctionCallOpen ? (
        isConnected ? (
          <SectionTabsContentContainer>
            <FunctionCallForm
              contractId={contractId}
              fnAbi={functionAbi}
              handleCancel={() => setIsFunctionCallOpen(false)}
            />
          </SectionTabsContentContainer>
        ) : (
          <SectionTabsContentContainer alignItems="center">
            <Button variant="redesignPrimary" onClick={connect} w="fit-content">
              Connect Stacks Wallet
            </Button>
          </SectionTabsContentContainer>
        )
      ) : (
        <>
          <FunctionResult tx={tx} />
          <FunctionArgs tx={tx} functionAbi={functionAbi} />
        </>
      )}
    </Stack>
  );
};
