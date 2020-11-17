import React, { useState } from 'react';
import { Box, Flex, Button, Stack } from '@stacks/ui';
import {
  ClarityFunctionArg,
  callReadOnlyFunction,
  network,
  parseReadOnlyResponse,
} from '@common/sandbox';
import { ContractInterfaceFunction, ContractInterfaceFunctionArg } from '@blockstack/rpc-client';
import { makeContractCall, PostConditionMode } from '@blockstack/stacks-transactions';
import { Formik } from 'formik';
import { Caption, Text } from '@components/typography';
import { Field } from '@components/sandbox/common';
import { Select } from '@components/select';
import { Card } from '@components/card';
import { valueToClarityValue } from '@common/sandbox';
import { useConfigState } from '@common/hooks/use-config-state';
import { useLoading } from '@common/hooks/use-loading';
import { TxLink } from '@components/links';

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
  return <></>;
};
