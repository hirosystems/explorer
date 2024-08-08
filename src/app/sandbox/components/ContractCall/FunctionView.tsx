'use client';

import { Icon } from '@/ui/Icon';
import { Switch } from '@/ui/Switch';
import { Tooltip } from '@/ui/Tooltip';
import { useColorMode } from '@/ui/hooks/useColorMode';
import { usePrevious } from '@chakra-ui/react';
import { Info } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import { openContractCall } from '@stacks/connect';
import {
  ClarityAbiFunction,
  ClarityValue,
  PostConditionMode,
  encodeAbiClarityValue,
  isClarityAbiList,
  isClarityAbiOptional,
  listCV,
} from '@stacks/transactions';

import { Section } from '../../../../common/components/Section';
import { CONNECT_AUTH_ORIGIN } from '../../../../common/constants/env';
import { useStacksNetwork } from '../../../../common/hooks/useStacksNetwork';
import { showFn } from '../../../../common/utils/sandbox';
import { Box } from '../../../../ui/Box';
import { Button } from '../../../../ui/Button';
import { Flex } from '../../../../ui/Flex';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { ListValueType, NonTupleValueType, TupleValueType, ValueType } from '../../types/values';
import { encodeOptional, encodeOptionalTuple, encodeTuple, getTuple } from '../../utils';
import { Argument } from '../Argument';
import {
  PostCondition,
  PostConditionParameters,
  PostConditionType,
  checkFunctionParameters,
  checkPostConditionParameters,
  getPostCondition,
} from './PostConditions';
import { ReadOnlyField } from './ReadOnlyField';

interface FunctionViewProps {
  fn: ClarityAbiFunction;
  contractId: string;
  cancelButton: ReactNode;
}

interface FormType {
  [key: string]: ValueType | ListValueType;
}

export type InitialValuesType = FormType & PostConditionParameters;

export const FunctionView: FC<FunctionViewProps> = ({ fn, contractId, cancelButton }) => {
  const [readOnlyValue, setReadonlyValue] = useState<ClarityValue[]>();
  const network = useStacksNetwork();
  const queryClient = useQueryClient();
  const colorMode = useColorMode();

  const [postConditionMode, setPostConditionMode] = useState<PostConditionMode>(
    PostConditionMode.Deny
  );
  const [showPostCondition, setShowPostCondition] = useState(false);
  const [postConditionType, setPostConditionType] = useState<PostConditionType | undefined>(
    undefined
  );
  const prevIsPostConditionModeEnabled = usePrevious(postConditionMode);

  useEffect(() => {
    if (!showPostCondition) {
      setPostConditionType(undefined);
    }
    if (
      prevIsPostConditionModeEnabled === PostConditionMode.Deny &&
      postConditionMode === PostConditionMode.Allow &&
      showPostCondition
    ) {
      setShowPostCondition(false);
    }
  }, [showPostCondition, postConditionMode, prevIsPostConditionModeEnabled]);

  const initialPostConditionParameterValues: PostConditionParameters = {
    postConditionAddress: undefined,
    postConditionAmount: undefined,
    postConditionConditionCode: undefined,
    postConditionAssetName: undefined,
    postConditionAssetAddress: undefined,
    postConditionAssetContractName: undefined,
  };

  const initialFunctionParameterValues = useMemo(
    () =>
      fn.args.reduce((argsAcc, arg) => {
        const tuple = getTuple(arg.type);
        const isList = isClarityAbiList(arg.type);
        argsAcc[arg.name] = !!tuple
          ? tuple.reduce(
              (tupleAcc, tupleEntry) => {
                tupleAcc[tupleEntry.name] = '';
                return tupleAcc;
              },
              {} as Record<string, string | number>
            )
          : isList
            ? []
            : '';
        return argsAcc;
      }, {} as FormType),
    [fn]
  );

  if (!showFn(contractId, fn)) {
    return (
      <Section
        overflowY="auto"
        flexGrow={1}
        title={`${fn.name} (${fn.access} function)`}
        borderRadius={'0'}
      >
        <Box p="32px">
          <Stack>
            <Text>Invalid function for {contractId}.</Text>
            {cancelButton}
          </Stack>
        </Box>
      </Section>
    );
  }

  return (
    <Formik
      initialValues={
        {
          ...initialFunctionParameterValues,
          ...initialPostConditionParameterValues,
        } as InitialValuesType
      }
      validateOnChange={false}
      validateOnBlur={false}
      validate={values => {
        const functionParametersErrors = checkFunctionParameters(fn, values);
        const postConditionParametersErrors = checkPostConditionParameters(
          values,
          postConditionType
        );
        const errors = Object.assign({}, functionParametersErrors, postConditionParametersErrors);
        if (showPostCondition && !postConditionType) {
          errors.postConditionType = 'Post condition is undefined';
        }
        return errors;
      }}
      onSubmit={async values => {
        const final: Record<string, ClarityValue> = {};
        Object.keys(values).forEach(arg => {
          const type = fn.args.find(({ name }) => name === arg)?.type;
          if (!type) return;
          const tuple = getTuple(type);
          const isList = isClarityAbiList(type);
          const optionalType = isClarityAbiOptional(type) ? type?.optional : undefined;
          if (tuple) {
            if (optionalType) {
              final[arg] = encodeOptionalTuple(tuple, values[arg] as TupleValueType);
            } else {
              final[arg] = encodeTuple(tuple, values[arg] as TupleValueType);
            }
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
                : encodeAbiClarityValue(
                    (listValue as NonTupleValueType).toString(),
                    optionalListType || listType
                  )
            );
            final[arg] = listCV(listData);
          } else if (optionalType) {
            final[arg] = encodeOptional(optionalType, values[arg] as NonTupleValueType);
          } else {
            final[arg] = encodeAbiClarityValue((values[arg] as NonTupleValueType).toString(), type);
          }
        });
        if (fn.access === 'public') {
          const {
            postConditionAddress,
            postConditionConditionCode,
            postConditionAmount,
            postConditionAssetAddress,
            postConditionAssetContractName,
            postConditionAssetName,
          } = values;

          const postConditions =
            showPostCondition && postConditionType
              ? getPostCondition(postConditionType, {
                  postConditionAddress,
                  postConditionConditionCode,
                  postConditionAmount,
                  postConditionAssetAddress,
                  postConditionAssetContractName,
                  postConditionAssetName,
                })
              : undefined;

          void openContractCall({
            contractAddress: contractId.split('.')[0],
            contractName: contractId.split('.')[1],
            functionName: encodeURIComponent(fn.name),
            functionArgs: Object.values(final),
            network,
            authOrigin: CONNECT_AUTH_ORIGIN,
            onFinish: () => {
              void queryClient.invalidateQueries({ queryKey: ['addressMempoolTxsInfinite'] });
            },
            postConditions: postConditions,
            postConditionMode: postConditionMode,
          });
        } else {
          setReadonlyValue(Object.values(final));
        }
      }}
    >
      {({ handleSubmit, handleChange, values, errors, setFieldValue }) => {
        return (
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
              <Box p={4}>
                <Form onSubmit={handleSubmit}>
                  <Stack gap={4}>
                    <Flex justifyContent="flex-end" alignItems="center" gap={2}>
                      <Text fontSize="sm">
                        {postConditionMode === PostConditionMode.Deny ? 'Deny Mode' : 'Allow Mode'}
                      </Text>
                      <Switch
                        id="post-condition-mode"
                        onChange={() => {
                          setPostConditionMode(
                            postConditionMode === PostConditionMode.Deny
                              ? PostConditionMode.Allow
                              : PostConditionMode.Deny
                          );
                        }}
                        isChecked={postConditionMode === PostConditionMode.Allow}
                      />
                      <Tooltip
                        label={
                          <Box>
                            Allow mode is less secure than Deny mode. Allow mode permits asset
                            transfers that are not covered by post conditions. In Deny mode no other
                            asset transfers are permitted besides those named in the post conditions
                          </Box>
                        }
                      >
                        <Icon as={Info} size={5} />
                      </Tooltip>
                    </Flex>
                    {fn.args.length ? (
                      <Stack mb="extra-loose" spacing="base" gap={4}>
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
                        {fn.access === 'public' && (
                          <PostCondition
                            postConditionMode={postConditionMode}
                            values={values}
                            errors={errors}
                            formikHandleChange={handleChange}
                          />
                        )}
                      </Stack>
                    ) : null}
                    <Flex flexDirection="column" alignItems="center" justifyContent="center">
                      <Button type="submit">Call function</Button>
                      {cancelButton}
                    </Flex>
                  </Stack>
                </Form>
              </Box>
            )}
          </Section>
        );
      }}
    </Formik>
  );
};
