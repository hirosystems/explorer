import React, { useState } from 'react';
import { Box, Flex, Button, Stack } from '@blockstack/ui';
import { ClarityFunctionArg, network } from '@common/sandbox';
import { ContractInterfaceFunction, ContractInterfaceFunctionArg } from '@blockstack/rpc-client';
import { makeContractCall } from '@blockstack/stacks-transactions';
import { Formik } from 'formik';
import { Caption, Text } from '@components/typography';
import { Field } from '@components/sandbox/common';
import { Card } from '@components/card';
import { valueToClarityValue } from '@common/sandbox';
import { useConfigState } from '@common/hooks/use-config-state';
import { useLoading } from '@common/hooks/use-loading';
import { useDebugState } from '@common/sandbox';
import { useDispatch } from 'react-redux';
import { broadcastTransaction } from '@store/sandbox';
import BigNum from 'bn.js';
import { TxLink } from '@components/links';

interface FunctionProps {
  func: ContractInterfaceFunction;
  contractName: string;
  contractAddress: string;
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

const ArgumentsForm = ({ state, loading, onSubmit }: any) => (
  <Formik
    enableReinitialize
    // @ts-ignore
    initialValues={Object.keys(state).reduce((a, b) => ((a[b] = ''), a), {})}
    onSubmit={onSubmit}
  >
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit} method="post">
        <Stack spacing="base">
          <Arguments args={Object.keys(state)} state={state} />
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

export const Function = ({ func, contractAddress, contractName }: FunctionProps) => {
  const [state, setState] = React.useState<FormState>({});
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const [result, setResult] = useState<string | undefined>(undefined);

  const dispatch = useDispatch();
  const { apiServer } = useConfigState();
  const { identity } = useDebugState();

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

  const onSubmit = React.useCallback(
    async (values: any) => {
      try {
        doStartLoading();
        const functionArgs = valuesToClarityArray(values);

        const tx = await makeContractCall({
          contractAddress,
          contractName,
          functionName: func.name,
          functionArgs,
          senderKey: identity?.privateKey as string,
          network: network(apiServer as string),
        });

        const { payload, error } = await dispatch(
          broadcastTransaction({ principal: identity?.address, tx })
        );
        if (error) return doFinishLoading();

        setResult(payload.transactions[0].txId);

        doFinishLoading();
      } catch (e) {
        console.error('ERROR', e);
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

        {func.access === 'public' ? (
          <ArgumentsForm state={state} loading={isLoading} onSubmit={onSubmit} />
        ) : (
          <Flex>
            <Caption>
              Read only calling is not currently available in the sandbox, check back soon. :)
            </Caption>
          </Flex>
        )}
        {result && (
          <Box mt="base">
            <Caption>
              Result:{' '}
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
            </Caption>
          </Box>
        )}
      </Stack>
    </Card>
  );
};
