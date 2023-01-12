import { Formik } from 'formik';
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import { openContractCall } from '@stacks/connect';
import {
  ClarityAbiFunction,
  ClarityValue,
  FungiblePostCondition,
  NonFungiblePostCondition,
  STXPostCondition,
  encodeClarityValue,
  getTypeString,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  listCV,
  makeContractCall,
} from '@stacks/transactions';
import { ClarityAbiType, ClarityAbiTypeUnion, getTypeUnion } from '@stacks/transactions';
import { Box, Button, Flex, IconButton, Input, Stack, color } from '@stacks/ui';

import { CONNECT_AUTH_ORIGIN } from '@common/constants';
import { useNetworkConfig } from '@common/hooks/use-network-config';
import { validateStacksAddress } from '@common/utils';

import { Dropdown } from '@components/Dropdown';
import { InfoCircleIcon } from '@components/icons/info-circle';
import { ToolsIcon } from '@components/icons/tools';
import { Section } from '@components/section';
import { Toggle } from '@components/toggle';
import { Tooltip } from '@components/tooltip';
import { Text } from '@components/typography';

import { ListValueType, NonTupleValueType, TupleValueType, ValueType } from '../../types';
import { encodeTuple, getTuple } from '../../utils';
import { Argument } from '../Argument';
import { PostCondition } from './PostCondition';
import { ReadOnlyField } from './ReadOnlyField';

interface FunctionViewProps {
  fn: ClarityAbiFunction;
  contractId: string;
  cancelButton: ReactNode;
}

enum PostConditionType {
  Stx = 'STXPostCondition',
  Fungible = 'FungiblePostCondition',
  NonFungible = 'NonFungiblePostCondition',
}

const postConditionParameterMap = {
  [PostConditionType.Stx]: ['Address', 'Post Condition Code', 'Amount'],
  [PostConditionType.Fungible]: ['Address', 'Post Condition Code', 'Amount'],
  [PostConditionType.NonFungible]: ['Address', 'Post Condition Code', 'Amount'],
};

const PostConditionOptions = [
  { label: 'STX Post Condition', value: PostConditionType.Stx },
  { label: 'Fungible Post Condition', value: PostConditionType.Fungible },
  { label: 'Non-Fungible Post Condition', value: PostConditionType.NonFungible },
];

type FormType = Record<string, ValueType | ListValueType>;

export const FunctionView: FC<FunctionViewProps> = ({ fn, contractId, cancelButton }) => {
  const [readOnlyValue, setReadonlyValue] = useState<ClarityValue[]>();
  const [isAllowMode, setAllowMode] = useState(false);
  const [showPostCondition, setShowPostCondition] = useState(false);
  // const [postCondition, setPostCondition] = useState<
  //   FungiblePostCondition | NonFungiblePostCondition | STXPostCondition | undefined
  // >(undefined);
  const [postCondition, setPostCondition] = useState<PostConditionType | undefined>(undefined);
  const network = useNetworkConfig();

  const initialFunctionParameterValues = useMemo(
    () =>
      fn.args.reduce((argsAcc, arg) => {
        const tuple = getTuple(arg.type);
        const isList = isClarityAbiList(arg.type);
        argsAcc[arg.name] = !!tuple
          ? tuple.reduce((tupleAcc, tupleEntry) => {
              tupleAcc[tupleEntry.name] = '';
              return tupleAcc;
            }, {} as Record<string, string | number>)
          : isList
          ? []
          : '';
        return argsAcc;
      }, {} as FormType),
    [fn]
  );

  useEffect(() => {
    if (!showPostCondition) {
      setPostCondition(undefined);
    }
  });

  const initialPostConditionParameterValues = {
    contractAddress: '',
    amount: '',
    conditionCode: undefined,
    assetName: '',
  };

  return (
    <Formik
      initialValues={{ ...initialFunctionParameterValues, ...initialPostConditionParameterValues }} // TODO: causing typing issues
      validateOnChange={false}
      validateOnBlur={false}
      validate={values => {
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
      }}
      onSubmit={values => {
        // TODO: refactor
        const final: Record<string, ClarityValue> = {};
        Object.keys(values).forEach(arg => {
          const type = fn.args.find(({ name }) => name === arg)?.type;
          if (!type) return;
          const tuple = getTuple(type);
          const isList = isClarityAbiList(type);
          const optionalType = isClarityAbiOptional(type) ? type?.optional : undefined;
          if (tuple) {
            final[arg] = encodeTuple(tuple, values[arg] as TupleValueType);
          } else if (isList) {
            const listValues = values[arg] as ListValueType;
            const listType = type.list.type;
            const optionalListType = isClarityAbiOptional(listType)
              ? listType?.optional
              : undefined;
            const listTuple = getTuple(listType);
            const listData = listValues.map(listValue =>
              listTuple
                ? encodeTuple(listTuple, listValue as TupleValueType)
                : encodeClarityValue(
                    optionalListType || listType,
                    (listValue as NonTupleValueType).toString()
                  )
            );
            final[arg] = listCV(listData);
          } else {
            final[arg] = encodeClarityValue(
              optionalType || type,
              (values[arg] as NonTupleValueType).toString()
            );
          }
        });
        if (fn.access === 'public') {
          // void makeContractCall({
          //   contractAddress: contractId.split('.')[0],
          //   contractName: contractId.split('.')[1],
          //   functionName: encodeURIComponent(fn.name),
          //   functionArgs: Object.values(final),
          //   network,
          //   authOrigin: CONNECT_AUTH_ORIGIN,
          // });
          void openContractCall({
            contractAddress: contractId.split('.')[0],
            contractName: contractId.split('.')[1],
            functionName: encodeURIComponent(fn.name),
            functionArgs: Object.values(final),
            network,
            authOrigin: CONNECT_AUTH_ORIGIN,
          });
        } else {
          setReadonlyValue(Object.values(final));
        }
      }}
      render={({ handleSubmit, handleChange, values, errors, setFieldValue }) => (
        <Section
          overflowY="visible"
          flexGrow={1}
          title={`${fn.name} (${fn.access} function)`}
          borderRadius={'0'}
        >
          {readOnlyValue ? (
            <ReadOnlyField
              fn={fn}
              readOnlyValue={readOnlyValue}
              contractId={contractId}
              cancelButton={cancelButton}
            />
          ) : (
            <Box p="extra-loose" as="form" onSubmit={handleSubmit}>
              {fn.args.length ? (
                <Stack mb="extra-loose" spacing="base">
                  {fn.args.map(({ name, type }) => (
                    <Argument
                      handleChange={handleChange}
                      name={name}
                      type={type}
                      error={errors[name]}
                      key={name}
                      value={values[name]}
                    />
                  ))}
                  <Button
                    onClick={() => {
                      setShowPostCondition(!showPostCondition);
                    }}
                  >
                    {!showPostCondition ? 'Add post condition' : 'Remove post condition'}
                  </Button>
                  {showPostCondition && (
                    <Box>
                      <Flex marginBottom="16px">
                        <Toggle
                          onClick={() => setAllowMode(!isAllowMode)} // TODO: If post condition is added, switch to deny
                          label="Allow Mode"
                          value={isAllowMode}
                        />
                        <Tooltip label="info">
                          <InfoCircleIcon size="18px" />
                        </Tooltip>
                        <Tooltip label="Contract tools">
                          <InfoCircleIcon size="18px" />
                          {/* <IconButton icon={ToolsIcon} /> */}
                        </Tooltip>
                      </Flex>
                      <Box maxWidth="260px" maxHeight="42px" height="42px" marginBottom="16px">
                        <Dropdown
                          defaultOption={{ label: 'Select a post condition', value: undefined }}
                          options={PostConditionOptions}
                          onChange={option => {
                            if (option.value === PostConditionType.Stx) {
                              setPostCondition(PostConditionType.Stx);
                            } else if (option.value === PostConditionType.Fungible) {
                              setPostCondition(PostConditionType.Fungible);
                            } else if (option.value === PostConditionType.NonFungible) {
                              setPostCondition(PostConditionType.NonFungible);
                            }
                          }}
                        />
                      </Box>

                      {postCondition && (
                        <Stack>
                          {postConditionParameterMap[postCondition].map(parameter => (
                            <Box>
                              <Text
                                fontSize="12px"
                                fontWeight="500"
                                display="block"
                                color={color('text-caption')}
                                htmlFor={parameter}
                                mb="tight"
                              >
                                {parameter}
                              </Text>
                              <Box width="100%">
                                <Input
                                  width="100%"
                                  // type={getTypeString(type).includes('int') ? 'number' : 'text'}
                                  name={parameter}
                                  id={parameter}
                                  onChange={handleChange}
                                  value={values[parameter]}
                                  // placeholder={`${getTypeString(type)}`}
                                />
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  )}
                </Stack>
              ) : null}
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button type="submit">Call function</Button>
                {cancelButton}
              </Flex>
            </Box>
          )}
        </Section>
      )}
    />
  );
};
