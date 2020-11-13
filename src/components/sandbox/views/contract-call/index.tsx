// @ts-nocheck
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { validateStacksAddress, onPaste } from '@common/utils';
import { Box, BoxProps, color, Flex, Grid, Stack, transition } from '@stacks/ui';
import { atom, useRecoilValue, useRecoilState, useSetRecoilState, selectorFamily } from 'recoil';
import { Input } from '@components/sandbox/common';
import { useFormik } from 'formik';
import { Button } from '@components/button';
import { border, truncateMiddle } from '@common/utils';
import { Caption, Link, Text, Title } from '@components/typography';
import { Error } from '@components/sandbox/error';
import {
  txContractState,
  currentFunctionState,
  contractSearchQueryState,
  contractCallViewState,
} from '@components/sandbox/state/atoms';
import { useApiServer } from '@common/hooks/use-api';
import { Section } from '@components/section';
import { Badge } from '@components/badge';
import { IconButton } from '@components/icon-button';
import pluralize from 'pluralize';
import { ItemIcon } from '@components/item-icon';
import {
  ClarityAbiFunction,
  encodeClarityValue,
  getTypeString,
  tupleCV,
} from '@stacks/transactions';
import { ArrowLeftIcon } from '@components/icons/arrow-left';
import { ArrowRightIcon } from '@components/icons/arrow-right';
import ApiIcon from 'mdi-react/ApiIcon';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { LoadingPanel } from '@components/loading-panel';
import { useHover } from 'use-events';
import { openContractCall } from '@stacks/connect';
import { useUser } from '@common/hooks/use-user';
import { StacksTestnet } from '@stacks/network';
import { callReadOnlyFunction, parseReadOnlyResponse } from '@common/sandbox';
import { AtomIcon } from '@components/icons/atom';
import ListStatusIcon from 'mdi-react/ListStatusIcon';
import { FungibleTokenIcon } from '@components/icons/fungible-token';
import { ExternalLinkIcon } from '@components/icons/external-link';
import { TxLink } from '@components/links';
import { CodeBlock } from '@components/code-block';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';
import { Circle } from '@components/circle';

const useContractInterface = (): [any, string, ClarityAbiFunction] => {
  const apiServer = useApiServer();
  const contractId = useRecoilValue(contractSearchQueryState);
  const functionName = useRecoilValue(currentFunctionState);
  const contractInterface = useRecoilValue(txContractState({ apiServer, contractId }));
  const func = functionName
    ? contractInterface?.abi?.functions.find(fn => fn.name === functionName)
    : undefined;

  return [contractInterface, contractId, func];
};

const PluralizedItem: React.FC<BoxProps & { array: any[]; label: string }> = ({
  array,
  label,
  ...rest
}) => (
  <Caption color={color('text-body')} fontSize="14px" {...rest}>
    {array.length} {pluralize(label, array.length)}
  </Caption>
);

const Details = () => {
  const [contractInterface, contractId] = useContractInterface();
  const [view, setView] = React.useState(undefined);
  return contractInterface ? (
    <Section
      topRight={
        <TxLink txid={contractId}>
          <Flex
            as="a"
            target="_blank"
            color={color('text-caption')}
            _hover={{ color: color('text-body') }}
            alignItems="center"
          >
            <Caption transform="translateY(1px)" color="currentColor">
              Go to transaction
            </Caption>
            <ExternalLinkIcon ml="tight" color="currentColor" size="16px" />
          </Flex>
        </TxLink>
      }
      flexShrink={0}
      mb="extra-loose"
      minWidth="200px"
      title="Contract details"
    >
      <Box>
        <Flex p="base" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <ItemIcon size="64px" type="tx" txType="smart_contract" status="success" />
            <Box ml="base">
              <Title mb="tight" display="block" mt="0" as="h3">
                {truncateMiddle(contractId.split('.')[0])}.{contractId.split('.')[1]}
              </Title>
              <Caption display="block">{truncateMiddle(contractInterface?.tx_id, 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Grid borderTop={border()} textAlign="center" gridTemplateColumns="repeat(4,1fr)" p="base">
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <FunctionIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface?.abi?.functions} label="function" />
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <AtomIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface?.abi?.variables} label="variable" />
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <ListStatusIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface?.abi?.maps} label="map" />
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <FungibleTokenIcon color={color('text-caption')} strokeWidth={2} size="20px" />
            </Box>
            <PluralizedItem
              ml="tight"
              array={[
                ...contractInterface?.abi?.fungible_tokens,
                ...contractInterface?.abi?.non_fungible_tokens,
              ]}
              label="token"
            />
          </Flex>
        </Grid>
      </Box>
    </Section>
  ) : null;
};

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

const readOnlyState = atom({
  key: 'sandbox.contract-call.read-only',
  default: undefined,
});

const readOnlyResponseState = selectorFamily({
  key: 'sandbox.contract-call.read-only.response',
  get: ({
    contractName,
    contractAddress,
    functionName,
    functionArgs = [],
    senderAddress,
    apiServer,
  }) => async () => {
    const network = new StacksTestnet();
    network.coreApiUrl = apiServer;
    return callReadOnlyFunction({
      contractName,
      contractAddress,
      functionName,
      functionArgs,
      network,
      senderAddress,
    });
  },
});

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
            void openContractCall({
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
const AvailableFunctions = () => {
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

const BackElement = props => {
  const [isHovered, bind] = useHover();
  return (
    <Flex alignItems="center" mb="base" _hover={{ cursor: 'pointer' }} {...props} {...bind}>
      <IconButton mr="tight" icon={ArrowLeftIcon} dark isHovered={isHovered} />
      <Box
        color={isHovered ? color('text-body') : color('text-caption')}
        transform={isHovered ? 'none' : 'translateX(-8px)'}
        transition={transition}
        fontSize="14px"
      >
        Back to search
      </Box>
    </Flex>
  );
};

const ContractCall = ({ setView }) => {
  return (
    <Flex
      maxHeight="900px"
      overflow="auto"
      px="extra-loose"
      pt="base"
      pb="extra-loose"
      flexDirection="column"
    >
      <BackElement onClick={() => setView('search')} />
      <Details />
      <React.Suspense fallback={<LoadingPanel text="Loading..." />}>
        <AvailableFunctions />
      </React.Suspense>
    </Flex>
  );
};

export const ContractSearch = ({ setView }) => {
  const setQuery = useSetRecoilState(contractSearchQueryState);
  const { handleSubmit, handleChange, handleBlur, values, setValues, errors } = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      principal: 'ST000000000000000000002AMW42H',
      contract_name: 'pox',
    },
    validate: values => {
      const errors = {};
      const validPrincipal = validateStacksAddress(values.principal);
      if (!validPrincipal) {
        errors.principal = 'Invalid Stacks address.';
      }
      if (!values.contract_name) {
        errors.contract_name = 'Contract name required.';
      }
      return errors;
    },
    onSubmit: ({ principal, contract_name }) => {
      setQuery(`${principal}.${contract_name}`);
      setView('fn');
    },
  });

  const handlePaste = (e: any) =>
    onPaste(e, (value: string) => {
      const theValue = value.trim().toString();
      if (theValue.includes('.')) {
        const principal = theValue.split('.')[0];
        const contract_name = theValue.split('.')[1];

        setTimeout(() => {
          setValues({
            principal,
            contract_name,
          });
        }, 0);
      }
    });
  return (
    <Flex maxHeight="900px" flexDirection="column" p="extra-loose">
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing="base">
          <Title fontSize="24px">Call a contract</Title>
          <Text color={color('text-body')} maxWidth="42ch" lineHeight="1.6" display="block" my={0}>
            Manually enter contract details below, or load a contract from your transactions to see
            available functions.
          </Text>
          <Caption>
            Hint: you can paste the{' '}
            <Link
              display="inline"
              textDecoration="underline"
              href="https://docs.blockstack.org/smart-contracts/principals#smart-contracts-as-principals"
              target="_blank"
            >
              smart contracts' identifier
            </Link>{' '}
            in this format: [principal].[contract-name]
          </Caption>
          {Object.keys(errors)?.length ? (
            <Error>{errors?.principal || errors?.contract_name}</Error>
          ) : null}
          <Input
            id="principal"
            name="principal"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.principal}
            placeholder="Enter the contract address"
            onPaste={handlePaste}
          />
          <Input
            id="contract_name"
            name="contract_name"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contract_name}
            placeholder="Enter the contract name"
          />
          <Box>
            <Button type="submit">Get contract</Button>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Stack spacing="loose" p="extra-loose" role="alert">
      <Flex flexDirection="column" borderRadius="8px" alignItems="center">
        <Circle mb="loose" transform="translateY(2px)" size="84px" mr="tight" border={border()}>
          <AlertTriangleIcon size="52px" color={color('feedback-error')} />
        </Circle>
        <Title mb="base" fontSize="24px">
          Something went wrong
        </Title>
        <Text color={color('text-body')} lineHeight="26px" maxWidth="50ch" textAlign="center">
          {error}
        </Text>
      </Flex>
      <Button mx="auto" onClick={resetErrorBoundary}>
        Search again
      </Button>
    </Stack>
  );
}

export const ContractCallView = () => {
  const [view, setView] = useRecoilState(contractCallViewState);
  const [query, setQuery] = useRecoilState(contractSearchQueryState);

  switch (view) {
    case 'fn':
      return (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setView('search');
            setQuery(undefined);
          }}
        >
          <React.Suspense fallback={<LoadingPanel text="Loading contract data..." />}>
            <ContractCall setView={setView} />
          </React.Suspense>
        </ErrorBoundary>
      );
    default:
      return <ContractSearch setView={setView} />;
  }
};
