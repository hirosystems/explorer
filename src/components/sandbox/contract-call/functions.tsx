import React, { useState } from 'react';
import { Box, Flex, Button, Stack } from '@blockstack/ui';
import {
  ClarityFunctionArg,
  callReadOnlyFunction,
  network,
  parseReadOnlyResponse,
} from '@common/sandbox';
import { ContractInterfaceFunction, ContractInterfaceFunctionArg } from '@blockstack/rpc-client';
import { makeContractCall, PostConditionMode } from '@stacks/transactions';
import { Formik } from 'formik';
import { Caption, Text } from '@components/typography';
import { Field } from '@components/sandbox/common';
import { Select } from '@components/select';
import { Card } from '@components/card';
import { valueToClarityValue } from '@common/sandbox';
import { useConfigState } from '@common/hooks/use-config-state';
import { useLoading } from '@common/hooks/use-loading';
import { useDispatch } from 'react-redux';
import { broadcastTransaction } from '@store/sandbox';
import { TxLink } from '@components/links';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

interface FunctionProps {
  func: ContractInterfaceFunction;
  contractName: string;
  contractAddress: string;
  showTransactionDialog: () => void;
}

interface Arg extends ContractInterfaceFunctionArg {
  value: string;
}

interface FormState {
  [key: string]: Arg;
}

const TypeLabel = (props: any) => (
  <Text
    bg="var(--colors-invert)"
    display="inline-block"
    color="var(--colors-bg)"
    fontWeight="600"
    borderRadius="3px"
    fontSize="10px"
    opacity={0.4}
    px="extra-tight"
    {...props}
  />
);

const Arguments = ({ args, state, ...rest }: any) =>
  args
    ? args.map((argKey: string) => {
        const arg = state[argKey];
        const argType = typeof arg.type === 'string' ? arg.type : 'buffer';
        return (
          <Box key={argKey} mb={2} {...rest}>
            <Field
              name={arg.name}
              placeholder={argType}
              label={
                <>
                  {arg.name}
                  <TypeLabel ml="extra-tight">{Object.keys(arg.type)[0].toString()}</TypeLabel>
                </>
              }
            />
          </Box>
        );
      })
    : null;

const ArgumentsForm = ({ state, loading, onSubmit }: any) => {
  // @ts-ignore
  const stateValues = Object.keys(state).reduce((a, b) => ((a[b] = ''), a), {});
  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...stateValues,
        postConditionMode: PostConditionMode.Deny.toString(),
      }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit} method="post">
          <Stack spacing="base">
            {Object.keys(state).length ? (
              <Arguments args={Object.keys(state)} state={state} />
            ) : null}
            <Select
              mb="base"
              setFieldValue={setFieldValue}
              options={[
                { label: 'Deny', value: PostConditionMode.Deny.toString(), key: 0 },
                { label: 'Allow', value: PostConditionMode.Allow.toString(), key: 1 },
              ]}
              label="Post condition mode"
              name="postConditionMode"
            />
            <Box>
              <Button isLoading={loading} loadingText="Loading" size="md">
                Submit
              </Button>
            </Box>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

export const Function = ({
  func,
  contractAddress,
  contractName,
  showTransactionDialog,
}: FunctionProps) => {
  const [state, setState] = React.useState<FormState>({});
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const [result, setResult] = useState<string | undefined>(undefined);

  const { apiServer } = useConfigState();
  const { identity, doBroadcastTransaction, doFetchAccount } = useSandboxState();

  React.useEffect(() => {
    const newState: FormState = {};
    func.args.forEach(arg => {
      newState[arg.name] = {
        ...arg,
        value: '',
      };
    });
    setState(newState);
  }, [func.name]);

  const valuesToClarityArray = (values: any) =>
    Object.keys(values).map(name =>
      valueToClarityValue(values[name], state[name] as ClarityFunctionArg)
    );

  const net = network(apiServer as string);

  const onSubmit = React.useCallback(
    async (values?: any) => {
      if (!identity) return console.error('Not logged in!');
      const { postConditionMode: stringPostConditionMode, ...clarityValues } = values;

      const postConditionMode =
        stringPostConditionMode === PostConditionMode.Deny.toString()
          ? PostConditionMode.Deny
          : PostConditionMode.Allow;

      try {
        doStartLoading();
        const functionArgs = clarityValues ? valuesToClarityArray(clarityValues) : [];

        if (func.access === 'public') {
          const tx = await makeContractCall({
            contractAddress,
            contractName,
            functionName: func.name,
            functionArgs,
            senderKey: identity?.privateKey,
            network: net,
            postConditionMode,
          });

          const response: any = await doBroadcastTransaction({
            principal: identity.address,
            tx,
          });

          if (response.error || !response.transactions[0].txId) return doFinishLoading();

          setResult(response.transactions[0].txId);
          showTransactionDialog();

          doFinishLoading();
        } else {
          const value = await callReadOnlyFunction({
            senderAddress: identity.address,
            contractAddress,
            contractName,
            functionArgs,
            functionName: func.name,
            network: net,
          });
          const result = parseReadOnlyResponse(value);
          setResult(result);
          doFinishLoading();
        }
      } catch (e) {
        doFinishLoading();
      }
    },
    [state]
  );

  return (
    <Card p="base" width="100%" mb={6}>
      <Stack spacing="base">
        <Flex align="center">
          <Text color="var(--colors-text-title)" fontFamily="'Fira Code', monospace">
            ({func.name})
          </Text>
          <TypeLabel ml="extra-tight">{func.access} function</TypeLabel>
        </Flex>

        <ArgumentsForm state={state} loading={isLoading} onSubmit={onSubmit} />

        {result && (
          <Box mt="base">
            <Caption>
              Result:{' '}
              {result.includes('0x') ? (
                <TxLink txid={result}>
                  <Caption
                    as="a"
                    // @ts-ignore
                    target="_blank"
                    cursor="pointer"
                    textDecoration="underline"
                    color="var(--colors-accent)"
                  >
                    {result}
                  </Caption>
                </TxLink>
              ) : (
                <Caption>{result}</Caption>
              )}
            </Caption>
          </Box>
        )}
      </Stack>
    </Card>
  );
};
