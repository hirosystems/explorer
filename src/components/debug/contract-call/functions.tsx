import React from 'react';
import { Box, Flex, Button, Stack } from '@blockstack/ui';
import { ContractInterfaceFunction, ContractInterfaceFunctionArg } from '@blockstack/rpc-client';

import { Text } from '@components/typography';
import { FieldBase } from '@components/debug/common';
import { Card } from '@components/card';

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
            <FieldBase
              // @ts-ignore
              field={{
                value: arg.value,
              }}
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
  <Box
    as="form"
    // @ts-ignore
    onSubmit={onSubmit}
  >
    <Stack spacing="base">
      <Arguments args={Object.keys(state)} state={state} />
      <Box>
        <Button isLoading={loading} loadingText="Loading" size="md">
          Submit
        </Button>
      </Box>
    </Stack>
  </Box>
);

export const Function = ({ func }: FunctionProps) => {
  const [state, setState] = React.useState<FormState>({});
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

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
          <ArgumentsForm state={state} loading={loading} onSubmit={() => console.log('submit')} />
        ) : null}
        {result && <Text>Result: {result}</Text>}
      </Stack>
    </Card>
  );
};
