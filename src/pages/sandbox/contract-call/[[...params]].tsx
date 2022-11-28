import React, { ChangeEvent, FC, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import {
  Box,
  Button,
  Circle,
  color,
  Flex,
  Grid,
  IconButton,
  Input,
  Stack,
  transition,
} from '@stacks/ui';
import { border, onPaste, truncateMiddle, validateStacksAddress } from '@common/utils';
import { Caption, Link, Text, Title } from '@components/typography';
import { Layout } from '@modules/sandbox/components/Layout';
import { useRouter } from 'next/router';
import { Section } from '@components/section';
import {
  IconChartBar,
  IconCurrencyBitcoin,
  IconCurrencyDollar,
  IconSignature,
} from '@tabler/icons';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';
import { useApi } from '@common/api/client';
import { buildUrl, ExplorerLink, TxLink } from '@components/links';
import NextLink from 'next/link';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { ExternalLinkIcon } from '@components/icons/external-link';
import { ItemIcon } from '@components/item-icon';
import { PluralizedCaption } from '@components/pluralized-caption';
import { AtomIcon } from '@components/icons/atom';
import { FungibleTokenIcon } from '@components/icons/fungible-token';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { Badge } from '@components/badge';
import { ArrowRightIcon } from '@components/icons/arrow-right';
import Icon from '@mdi/react';
import { mdiApi, mdiFunction, mdiListStatus } from '@mdi/js';
import {
  ClarityAbiFunction,
  ClarityAbiType,
  ClarityAbiTypeTuple,
  ClarityValue,
  encodeClarityValue,
  getTypeString,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  isClarityAbiTuple,
  tupleCV,
} from '@stacks/transactions';
import { useUser } from '@modules/sandbox/hooks/useUser';
import { useNetworkConfig } from '@common/hooks/use-network-config';
import { callReadOnlyFunction, parseReadOnlyResponse } from '@modules/sandbox/utils';
import { CodeBlock } from '@components/code-block';
import { useHover } from 'use-events';
import { ArrowLeftIcon } from '@components/icons/arrow-left';
import { openContractCall } from '@stacks/connect';
import { CONNECT_AUTH_ORIGIN } from '@common/constants';
import { ContractWithParsedAbi } from '@common/types/contract';

const defaultContracts = (address: string) => [
  {
    name: 'pox',
    address,
    description: '',
    icon: IconCurrencyBitcoin,
  },
  {
    name: 'bns',
    address,
    description: '',
    icon: IconSignature,
  },
  {
    name: 'cost-voting',
    address,
    description: '',
    icon: IconChartBar,
  },
  {
    name: 'costs',
    address,
    description: '',
    icon: IconCurrencyDollar,
  },
];

const getTuple = (type?: ClarityAbiType): ClarityAbiTypeTuple['tuple'] | undefined => {
  if (!type) return;
  const isTuple = isClarityAbiTuple(type);
  if (isTuple) return type?.tuple;
  const isOptional = isClarityAbiOptional(type);
  if (isOptional && isClarityAbiTuple(type?.optional)) return type?.optional?.tuple;
};

interface ArgLineProps {
  name: string;
  placeholder?: string;
  type: ClarityAbiType;
  handleChange: (e: ChangeEvent) => void;
  error: any;
  value: string | number;
}
const ArgLine: FC<ArgLineProps> = ({
  name,
  type,
  handleChange,
  placeholder = name,
  error,
  value,
}) => (
  <Box width="100%">
    <Input
      width="100%"
      type={getTypeString(type).includes('int') ? 'number' : 'text'}
      name={name}
      id={name}
      onChange={handleChange}
      value={value}
      placeholder={`${getTypeString(type)}`}
    />
    {error && <Caption color={color('feedback-error')}>{error}</Caption>}
  </Box>
);

interface FunctionLineProps {
  name: string;
  type: ClarityAbiType;
  handleChange: (e: ChangeEvent) => void;
  error: any;
  value: ValueType;
}

const FunctionLine: FC<FunctionLineProps> = ({ name, type, handleChange, error, value }) => {
  const tuple = getTuple(type);
  const isOptional = isClarityAbiOptional(type);
  if (!!tuple) {
    return (
      <Box>
        <Stack id={name} isInline spacing="base" width="100%">
          {tuple.map(tupleEntry => (
            <Box flexGrow={1} key={tupleEntry.name}>
              <Text
                fontSize="12px"
                fontWeight="500"
                display="block"
                color={color('text-caption')}
                htmlFor={name}
                mb="tight"
              >
                ({name}): {tupleEntry.name}
                {isOptional ? ' (optional)' : ''}
              </Text>
              <ArgLine
                name={`${name}.${tupleEntry.name}`}
                type={type}
                handleChange={handleChange}
                error={error}
                value={(value as TupleValueType)[tupleEntry.name]}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }
  return (
    <Box>
      <Text
        fontSize="12px"
        fontWeight="500"
        display="block"
        color={color('text-caption')}
        htmlFor={name}
        mb="tight"
      >
        {name}
      </Text>
      <ArgLine
        name={name}
        type={type}
        handleChange={handleChange}
        error={error}
        value={value as NonTupleValueType}
      />
    </Box>
  );
};

interface ReadOnlyProps {
  readOnlyValue: ClarityValue[];
  contractId: string;
  fn: ClarityAbiFunction;
}

const ReadOnly: FC<ReadOnlyProps> = ({ readOnlyValue, contractId, fn }) => {
  const { stxAddress } = useUser();
  const stacksNetwork = useNetworkConfig();

  const { data } = useQuery(['readonly', contractId, fn.name], () =>
    callReadOnlyFunction({
      contractName: contractId.split('.')[1],
      contractAddress: contractId.split('.')[0],
      functionName: fn.name,
      functionArgs: readOnlyValue,
      network: stacksNetwork,
      senderAddress: stxAddress,
    })
  );

  if (!data) return null;

  return (
    <Box p="base">
      {data.okay ? (
        <Section title="Response">
          <CodeBlock code={parseReadOnlyResponse(data)} />
        </Section>
      ) : (
        <Box>{data.result}</Box>
      )}
      <Flex alignItems="center" justifyContent="center" pt="base">
        <ExplorerLink path={`/sandbox/contract-call/${contractId}`}>
          <Button>Back</Button>
        </ExplorerLink>
      </Flex>
    </Box>
  );
};

type TupleValueType = Record<string, string | number>;

type NonTupleValueType = string | number;

type ValueType = TupleValueType | NonTupleValueType;

type FormType = Record<string, ValueType>;

interface FunctionViewProps {
  fn: ClarityAbiFunction;
  contractId: string;
}

export const FunctionView: FC<FunctionViewProps> = ({ fn, contractId }) => {
  const [readOnlyValue, setReadonlyValue] = useState<ClarityValue[]>();
  const stacksNetwork = useNetworkConfig();

  const initialValues = useMemo(
    () =>
      fn.args.reduce((argsAcc, arg) => {
        const tuple = getTuple(arg.type);
        argsAcc[arg.name] = !!tuple
          ? tuple.reduce((tupleAcc, tupleEntry) => {
              tupleAcc[tupleEntry.name] = '';
              return tupleAcc;
            }, {} as Record<string, string | number>)
          : '';
        return argsAcc;
      }, {} as FormType),
    [fn]
  );

  const { handleSubmit, handleChange, values, errors } = useFormik<FormType>({
    initialValues,
    validateOnChange: false,
    validateOnBlur: false,
    validate: values => {
      const errors: Record<string, string> = {};
      Object.keys(values).forEach(arg => {
        const type = fn.args.find(({ name }) => name === arg)?.type;
        const isOptional = type && isClarityAbiOptional(type);
        const optionalTypeIsPrincipal =
          isOptional && isClarityAbiPrimitive(type.optional) && type.optional === 'principal';
        if (type === 'principal' || (optionalTypeIsPrincipal && !!values[arg])) {
          const validPrincipal = validateStacksAddress(
            (values[arg] as NonTupleValueType).toString().split('.')[0]
          );
          if (!validPrincipal) {
            errors[arg] = 'Invalid Stacks address.';
          }
        }
      });
      return errors;
    },
    onSubmit: values => {
      const final: Record<string, ClarityValue> = {};
      Object.keys(values).forEach(arg => {
        const type = fn.args.find(({ name }) => name === arg)?.type;
        if (!type) return;
        const tuple = getTuple(type);
        const optionalType = isClarityAbiOptional(type) ? type?.optional : undefined;
        if (tuple) {
          const tupleData = tuple.reduce((acc, tupleEntry) => {
            const _type = tupleEntry.type;
            acc[tupleEntry.name] = encodeClarityValue(
              _type,
              (values[arg] as TupleValueType)[tupleEntry.name].toString()
            );
            return acc;
          }, {} as Record<string, ClarityValue>);
          final[arg] = tupleCV(tupleData);
        } else {
          final[arg] = encodeClarityValue(
            optionalType || type,
            (values[arg] as NonTupleValueType).toString()
          );
        }
      });
      if (fn.access === 'public') {
        void openContractCall({
          contractAddress: contractId.split('.')[0],
          contractName: contractId.split('.')[1],
          functionName: encodeURIComponent(fn.name),
          functionArgs: Object.values(final),
          network: stacksNetwork,
          authOrigin: CONNECT_AUTH_ORIGIN,
        });
      } else {
        setReadonlyValue(Object.values(final));
      }
    },
  });

  return (
    <Section overflowY="auto" flexGrow={1} title={`${fn.name} (${fn.access} function)`}>
      {readOnlyValue ? (
        <ReadOnly fn={fn} readOnlyValue={readOnlyValue} contractId={contractId} />
      ) : (
        <Box p="extra-loose" as="form" onSubmit={handleSubmit}>
          {fn.args.length ? (
            <Stack mb="extra-loose" spacing="base">
              {fn.args.map(({ name, type }) => (
                <FunctionLine
                  handleChange={handleChange}
                  name={name}
                  type={type}
                  error={errors[name]}
                  key={name}
                  value={values[name]}
                />
              ))}
            </Stack>
          ) : null}
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Button type="submit">Call function</Button>
            <ExplorerLink path={`/sandbox/contract-call/${contractId}`}>
              <Caption _hover={{ cursor: 'pointer', color: color('text-title') }} mt="base">
                Cancel
              </Caption>
            </ExplorerLink>
          </Flex>
        </Box>
      )}
    </Section>
  );
};

interface ContractInfoProps {
  contract: ContractWithParsedAbi;
}

const ContractInfo: FC<ContractInfoProps> = ({ contract: { contract_id, abi } }) => {
  return (
    <Section
      topRight={() => (
        <TxLink txid={contract_id}>
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
      )}
      flexShrink={0}
      mb="extra-loose"
      title="Contract details"
    >
      <Box>
        <Flex p="base" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <ItemIcon size="64px" type="tx" />
            <Box ml="base">
              <Title mb="tight" display="block" mt="0" as="h3">
                {contract_id.split('.')[1]}
              </Title>
              <Caption display="block"> {truncateMiddle(contract_id.split('.')[0], 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Stack p="base">
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon path={mdiFunction} color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption ml="tight" array={abi?.functions} label="function" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <AtomIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption ml="tight" array={abi?.variables} label="variable" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon path={mdiListStatus} color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption ml="tight" array={abi?.maps} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FungibleTokenIcon color={color('text-caption')} strokeWidth={2} size="20px" />
            </Box>
            <PluralizedCaption
              ml="tight"
              array={[...(abi?.fungible_tokens || []), ...(abi?.non_fungible_tokens || [])]}
              label="token"
            />
          </Flex>
        </Stack>
      </Box>
    </Section>
  );
};

const PopularContracts: FC<{ rootContractAddress: string }> = ({ rootContractAddress }) => (
  <>
    <Title fontWeight={400}>Or select from one of these</Title>
    <Stack mt="loose" spacing="loose">
      {defaultContracts(rootContractAddress).map(({ name, address, icon: Icon }) => (
        <ExplorerLink path={`/sandbox/contract-call/${address}.${name}`} key={name}>
          <Section
            color={color('text-title')}
            p="loose"
            _hover={{ cursor: 'pointer', color: color('brand') }}
          >
            <Stack isInline spacing="base">
              <Circle border={border()}>
                <Icon />
              </Circle>
              <Stack>
                <Title color="currentColor">{name}</Title>
                <Caption>{address}</Caption>
              </Stack>
            </Stack>
          </Section>
        </ExplorerLink>
      ))}
    </Stack>
  </>
);

const SearchContractsForm: FC<{ rootContractAddress: string }> = ({ rootContractAddress }) => {
  const router = useRouter();
  const network = useAppSelector(selectActiveNetwork);
  const { handleSubmit, handleChange, handleBlur, values, setValues, errors } = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    initialValues: {
      principal: rootContractAddress,
      contract_name: 'pox',
    },
    validate: values => {
      const errors: any = {};
      const validPrincipal = validateStacksAddress(values.principal);
      if (!validPrincipal) {
        errors['principal'] = 'Invalid Stacks address.';
      }
      if (!values.contract_name) {
        errors['contract_name'] = 'Contract name required.';
      }
      return errors;
    },
    onSubmit: ({ principal, contract_name }) =>
      router.push(buildUrl(`/sandbox/contract-call/${principal}.${contract_name}`, network)),
  });

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) =>
    onPaste(e, (value: string) => {
      const cleanValue = value.trim().toString();
      if (cleanValue.includes('.')) {
        const [principal, contract_name] = cleanValue.split('.');

        setTimeout(() => {
          void setValues({
            principal,
            contract_name,
          });
        }, 0);
      }
    });

  return (
    <Flex maxHeight="900px" flexDirection="column" p="loose">
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
            <Box
              borderRadius="6px"
              bg="rgba(207,0,0,0.05)"
              border="1px solid rgba(207,0,0,0.1)"
              px="base"
              py="tight"
              color="red"
              lineHeight="1.8"
              fontSize="14px"
              wordBreak="break-all"
            >
              {errors?.principal || errors?.contract_name}
            </Box>
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

const AvailableFunctionsView: FC<{
  contract: ContractInfoProps['contract'];
  contractId: string;
}> = ({ contractId, contract }) => (
  <Section overflowY="auto" flexGrow={1} title="Available functions">
    {contract?.abi?.functions.map(
      (abiFn: any) =>
        abiFn.access !== 'private' && (
          <ExplorerLink
            path={`/sandbox/contract-call/${contractId}/${abiFn.name}`}
            key={abiFn.name}
          >
            <Flex
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
                    {abiFn.access === 'read_only' ? (
                      <Icon path={mdiApi} size="20px" />
                    ) : (
                      <Icon path={mdiFunction} size="20px" />
                    )}
                  </Grid>
                  <Text
                    fontSize="14px"
                    fontFamily={`"Fira Code", monospace`}
                    ml="base"
                    fontWeight="500"
                    color={color('text-body')}
                  >
                    {abiFn.name}
                  </Text>
                </Flex>
                {abiFn.access === 'read_only' && (
                  <Badge ml="base" bg={color('bg')} border={border()} color={color('text-caption')}>
                    {abiFn.access}
                  </Badge>
                )}
              </Flex>
              <IconButton icon={ArrowRightIcon} />
            </Flex>
          </ExplorerLink>
        )
    )}
  </Section>
);

export const BackLink: React.FC<{ href: string }> = ({ href }) => {
  const [isHovered, bind] = useHover();
  return (
    <NextLink href={href} passHref>
      <Flex alignItems="center" mb="base" _hover={{ cursor: 'pointer' }} {...bind}>
        <IconButton mr="tight" icon={ArrowLeftIcon} isHovered={isHovered} />
        <Box
          color={isHovered ? color('text-body') : color('text-caption')}
          transform={isHovered ? 'none' : 'translateX(-8px)'}
          transition={transition}
          fontSize="14px"
        >
          Back to search
        </Box>
      </Flex>
    </NextLink>
  );
};

const SelectedContractView: FC<{
  contract: ContractWithParsedAbi;
  functionName: string;
  contractId: string;
}> = ({ contract, functionName, contractId }) => {
  const network = useAppSelector(selectActiveNetwork);
  return (
    <Layout>
      <Grid
        minHeight="600px"
        width="calc((1142px / 3) * 2)"
        gridTemplateColumns="repeat(2, 1fr)"
        flexGrow={1}
        flexShrink={1}
      >
        <Box borderRight={border()} p="base">
          <BackLink href={buildUrl(`/sandbox/contract-call`, network)} />
          <ContractInfo contract={contract} />
        </Box>
        <Box overflow="auto" maxHeight="calc(100vh - 217px)" p="base">
          {functionName ? (
            <FunctionView
              contractId={contractId}
              fn={
                contract?.abi?.functions?.find(
                  (fn: any) => fn.name === functionName
                ) as unknown as ClarityAbiFunction
              }
            />
          ) : (
            <AvailableFunctionsView contract={contract} contractId={contractId} />
          )}
        </Box>
      </Grid>
    </Layout>
  );
};

const DefaultView: FC<{
  rootContractAddress: string;
}> = ({ rootContractAddress }) => (
  <Layout>
    <Grid
      minHeight="600px"
      width="calc((1142px / 3) * 2)"
      gridTemplateColumns="repeat(2, 1fr)"
      flexGrow={1}
      flexShrink={1}
    >
      <Box borderRight={border()}>
        <SearchContractsForm rootContractAddress={rootContractAddress} />
      </Box>
      <Box p="base">
        <PopularContracts rootContractAddress={rootContractAddress} />
      </Box>
    </Grid>
  </Layout>
);

const ContractCall: NextPage = () => {
  const { query } = useRouter();
  const contractId = query?.params?.[0] || '';
  const functionName = query?.params?.[1] || '';
  const { infoApi } = useApi();
  const { data: poxInfo } = useQuery('pox-info', () => infoApi.getPoxInfo(), { staleTime: 5000 });
  const rootContractAddress = poxInfo?.contract_id?.split('.')?.[0];
  const { url: activeNetworkUrl } = useAppSelector(selectActiveNetwork);

  const queries = getTransactionQueries(activeNetworkUrl);

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId),
    {
      enabled: !!contractId,
    }
  );

  if (!rootContractAddress) return null;

  if (!!contract) {
    return (
      <SelectedContractView
        contract={contract}
        functionName={functionName}
        contractId={contractId}
      />
    );
  }

  return <DefaultView rootContractAddress={rootContractAddress} />;
};

export default ContractCall;
