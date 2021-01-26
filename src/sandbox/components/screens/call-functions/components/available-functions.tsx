// @ts-nocheck
import React from 'react';
import { Box, BoxProps, color, Flex, Grid, Stack, transition } from '@stacks/ui';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { Input } from '@components/inputs';
import { useFormik } from 'formik';
import { Button } from '@components/button';
import { border } from '@common/utils';
import { Caption, Text } from '@components/typography';
import { currentFunctionState, readOnlyState, readOnlyResponseState } from '@sandbox/store/sandbox';
import { useApiServer } from '@common/hooks/use-api';
import { Section } from '@components/section';
import { Badge } from '@components/badge';
import { IconButton } from '@components/icon-button';
import { encodeClarityValue, getTypeString, tupleCV } from '@stacks/transactions';
import { ArrowRightIcon } from '@components/icons/arrow-right';
import ApiIcon from 'mdi-react/ApiIcon';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { LoadingPanel } from '@components/loading-panel';

import { useUser } from '@sandbox/hooks/use-user';
import { parseReadOnlyResponse } from '@sandbox/common';
import { CodeBlock } from '@components/code-block';
import { handleContractCall } from '@sandbox/common/connect-functions';
import { useContractInterface } from '@sandbox/components/screens/call-functions/components/use-contract-interface';

const ArgLine = ({ name, type, handleChange, placeholder = name, ...rest }: any) => (
  <Box width="100%" {...rest}>
    <Input
      width="100%"
      type={getTypeString(type).includes('int') ? 'number' : 'text'}
      name={name}
      id={name}
      onChange={handleChange}
      placeholder={`${getTypeString(type)}`}
    />
  </Box>
);

const Label: React.FC<BoxProps> = props => (
  <Text
    as="label"
    fontSize="12px"
    fontWeight="500"
    display="block"
    color={color('text-caption')}
    {...props}
  />
);

const FunctionLine = ({ name, type, handleChange, ...rest }) => {
  const tuple = type?.tuple || type?.optional?.tuple;
  if (tuple) {
    return (
      <Box {...rest}>
        <Stack id={name} isInline spacing="base" width="100%">
          {tuple.map(arg => (
            <Box flexGrow={1}>
              <Label htmlFor={`${name}`} mb="tight">
                ({name}): {arg.name}
                {type?.optional ? ' (optional)' : ''}
              </Label>
              <ArgLine handleChange={handleChange} {...arg} name={`${name}.${arg.name}`} />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }
  return (
    <Box>
      <Label mb="tight" htmlFor={name}>
        {name}
      </Label>
      <ArgLine name={name} type={type} handleChange={handleChange} {...rest} />
    </Box>
  );
};

const Function = ({ func }) => {
  const setFunctionName = useSetRecoilState(currentFunctionState);

  return (
    <>
      <Flex
        onClick={() => setFunctionName(func.name)}
        justifyContent="space-between"
        p="base"
        borderBottom={border()}
        _hover={{
          cursor: 'pointer',
          bg: color('bg-alt'),
        }}
      >
        <Flex alignItems="center">
          <Flex alignItems="center">
            <Grid
              placeItems="center"
              border={border()}
              borderRadius="100%"
              size="32px"
              color={color('text-caption')}
            >
              {func.access === 'read_only' ? <ApiIcon size="20px" /> : <FunctionIcon size="20px" />}
            </Grid>
            <Text
              fontSize="14px"
              fontFamily={`"Fira Code", monospace`}
              ml="base"
              fontWeight="500"
              color={color('text-body')}
            >
              {func.name}
            </Text>
          </Flex>
          {func.access === 'read_only' && (
            <Badge ml="base" bg={color('bg')} border={border()} color={color('text-caption')}>
              {func.access}
            </Badge>
          )}
        </Flex>
        <IconButton dark icon={ArrowRightIcon} />
      </Flex>
    </>
  );
};

const ReadOnly = () => {
  const { principal } = useUser();
  const apiServer = useApiServer();
  const [contractInterface, contractId, fn] = useContractInterface();
  const setFunctionName = useSetRecoilState(currentFunctionState);
  const [readOnlyValue, setReadonly] = useRecoilState(readOnlyState);

  const response = useRecoilValue(
    readOnlyResponseState({
      contractName: contractId.split('.')[1],
      contractAddress: contractId.split('.')[0],
      functionName: fn.name,
      functionArgs: readOnlyValue,
      senderAddress: principal,
      apiServer,
    })
  );
  return (
    <Box p="base">
      {response.okay ? (
        <Section title="Response">
          <CodeBlock code={parseReadOnlyResponse(response)} />
        </Section>
      ) : (
        <Box>{response.cause}</Box>
      )}
      <Flex alignItems="center" justifyContent="center" pt="base">
        <Button
          onClick={() => {
            setReadonly(undefined);
            setFunctionName(undefined);
          }}
        >
          Back
        </Button>
      </Flex>
    </Box>
  );
};

const FunctionSingleView = () => {
  const [contractInterface, contractId, fn] = useContractInterface();
  const setFunctionName = useSetRecoilState(currentFunctionState);
  const [readOnlyValue, setReadonly] = useRecoilState(readOnlyState);
  const handleClearFnName = () => setFunctionName(undefined);
  const [initialValues, setInitialValues] = React.useState({});

  const { handleSubmit, handleChange, setValues, values } = useFormik({
    initialValues,
    onSubmit: values => {
      try {
        const final = {};
        Object.keys(values).forEach(key => {
          const type = fn.args.find(({ name }) => name === key).type;
          const tuple = type?.tuple || type?.optional?.tuple;
          const optional = type?.optional;
          if (tuple) {
            final[key] = {};
            tuple.forEach(k => {
              const _name = k.name;
              const _type = k.type;
              try {
                final[key][_name] = encodeClarityValue(_type, values[key][_name]);
              } catch (e) {
                final[key][_name] = values[key][_name];
              }
            });
            final[key] = tupleCV(final[key]);
          } else {
            try {
              final[key] = encodeClarityValue(optional || type, values[key]);
            } catch (e) {
              final[key] = values[key];
            }
          }
        });
        if (fn.access === 'public') {
          try {
            void handleContractCall({
              contractAddress: contractId.split('.')[0],
              contractName: contractId.split('.')[1],
              functionName: encodeURIComponent(fn.name),
              functionArgs: Object.values(final),
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          setReadonly(Object.values(final));
        }
      } catch (e) {
        console.log('error');
      }
    },
  });

  React.useEffect(() => {
    const obj = {};
    fn.args.forEach(arg => {
      obj[arg.name] = '';
    });
    setValues(obj);
  }, []);

  return (
    <Section overflowY="auto" flexGrow={1} title={`${fn.name} (${fn.access} function)`}>
      {readOnlyValue ? (
        <React.Suspense fallback={<LoadingPanel text="Loading..." />}>
          <ReadOnly />
        </React.Suspense>
      ) : (
        <Box p="extra-loose" as="form" onSubmit={handleSubmit}>
          {fn.args.length ? (
            <Stack mb="extra-loose" spacing="base">
              {fn.args.map(({ name, type }) => (
                <FunctionLine handleChange={handleChange} name={name} type={type} />
              ))}
            </Stack>
          ) : null}
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Button type="submit">Call function</Button>
            <Caption
              _hover={{ cursor: 'pointer', color: color('text-title') }}
              mt="base"
              onClick={handleClearFnName}
            >
              Cancel
            </Caption>
          </Flex>
        </Box>
      )}
    </Section>
  );
};

export const AvailableFunctions = () => {
  const [contractInterface, contractId, fn] = useContractInterface();

  return fn ? (
    <FunctionSingleView />
  ) : (
    <Section overflowY="auto" flexGrow={1} title="Available functions">
      {contractInterface?.abi?.functions.map(
        func => func.access !== 'private' && <Function func={func} />
      )}
    </Section>
  );
};
