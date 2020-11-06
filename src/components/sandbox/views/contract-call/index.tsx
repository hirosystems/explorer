// @ts-nocheck
import React from 'react';
import { Box, BoxProps, color, Flex, Grid, Stack, transition } from '@stacks/ui';
import { atom, useRecoilValue, useRecoilState, useSetRecoilState, selectorFamily } from 'recoil';
import { Input } from '@components/sandbox/common';
import { useFormik } from 'formik';
import { Button } from '@components/button';
import { border, truncateMiddle } from '@common/utils';
import { Caption, Text, Title } from '@components/typography';

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
import { ItemIcon } from '@components/transaction-item';
import { ClarityAbiFunction, encodeClarityValue, getTypeString } from '@stacks/transactions';
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

const useContractInterface = (): [any, string, ClarityAbiFunction] => {
  const apiServer = useApiServer();
  const contractId = useRecoilValue(contractSearchQueryState);
  const functionName = useRecoilValue(currentFunctionState);
  const contractInterface = useRecoilValue(txContractState({ apiServer, contractId }));
  const func = functionName
    ? contractInterface.abi.functions.find(fn => fn.name === functionName)
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
  return (
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
            <ItemIcon size="64px" type="smart_contract" status="success" />
            <Box ml="base">
              <Title mb="tight" display="block" mt="0" as="h3">
                {truncateMiddle(contractId.split('.')[0])}.{contractId.split('.')[1]}
              </Title>
              <Caption display="block">{truncateMiddle(contractInterface.tx_id, 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Grid borderTop={border()} textAlign="center" gridTemplateColumns="repeat(4,1fr)" p="base">
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <FunctionIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface.abi.functions} label="function" />
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <AtomIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface.abi.variables} label="variable" />
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <ListStatusIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface.abi.maps} label="map" />
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <Box opacity={0.6} size="20px">
              <FungibleTokenIcon color={color('text-caption')} strokeWidth={2} size="20px" />
            </Box>
            <PluralizedItem
              ml="tight"
              array={[
                ...contractInterface.abi.fungible_tokens,
                ...contractInterface.abi.non_fungible_tokens,
              ]}
              label="token"
            />
          </Flex>
        </Grid>
      </Box>
    </Section>
  );
};

const ArgLine = ({ name, type, handleChange, ...rest }: any) => (
  <Box width="100%" {...rest}>
    <Input
      width="100%"
      type={getTypeString(type).includes('int') ? 'number' : 'text'}
      name={name}
      id={name}
      onChange={handleChange}
      placeholder={`${name as string}   ${getTypeString(type)}`}
    />
  </Box>
);

const FunctionLine = ({ name, type, handleChange, ...rest }) => {
  // if (type?.tuple) {
  //   return (
  //     <Box {...rest}>
  //       <Text display="block" mb="tight" color={color('text-caption')}>
  //         {name}
  //       </Text>
  //       <Stack isInline spacing="base">
  //         {type.tuple.map(arg => (
  //           <ArgLine handleChange={handleChange} {...arg} />
  //         ))}
  //       </Stack>
  //     </Box>
  //   );
  // }
  return <ArgLine name={name} type={type} handleChange={handleChange} {...rest} />;
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

  const { handleSubmit, handleChange, setValues } = useFormik({
    initialValues,
    onSubmit: values => {
      const final = {};
      Object.keys(values).forEach(key => {
        console.log(fn.args.find(({ name }) => name === key).type, values[key]);
        try {
          final[key] = encodeClarityValue(
            fn.args.find(({ name }) => name === key).type,
            values[key]
          );
        } catch (e) {
          final[key] = values[key];
        }
      });
      if (fn.access === 'public') {
        void openContractCall({
          contractAddress: contractId.split('.')[0],
          contractName: contractId.split('.')[1],
          functionName: fn.name,
          functionArgs: Object.values(final),
        });
      } else {
        setReadonly(Object.values(final));
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
          <Stack justifyContent="center" isInline spacing="base">
            <Button variant="secondary" onClick={handleClearFnName}>
              Back
            </Button>
            <Button type="submit">Call function</Button>
          </Stack>
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
      {contractInterface.abi.functions.map(
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
  const { handleSubmit, handleChange, handleBlur, values } = useFormik({
    initialValues: {
      principal: 'ST000000000000000000002AMW42H',
      contract_name: 'pox',
    },
    onSubmit: ({ principal, contract_name }) => {
      setQuery(`${principal}.${contract_name}`);
      setView('fn');
    },
  });
  return (
    <Flex flexDirection="column" p="extra-loose">
      <Box mb="base-loose">
        <Text color={color('text-body')} maxWidth="42ch" lineHeight="1.6" display="block">
          Manually enter contract details below, or load a contract from your transactions to see
          available functions.
        </Text>
      </Box>
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing="base">
          <Input
            id="principal"
            name="principal"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.principal}
            placeholder="Enter the contract address"
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
export const ContractCallView = () => {
  const [view, setView] = useRecoilState(contractCallViewState);

  switch (view) {
    case 'fn':
      return (
        <React.Suspense fallback={<LoadingPanel text="Loading contract data..." />}>
          <ContractCall setView={setView} />
        </React.Suspense>
      );
    default:
      return <ContractSearch setView={setView} />;
  }
};
