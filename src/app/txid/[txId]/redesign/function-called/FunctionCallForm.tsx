'use client';

import {
  ListValueType,
  NonTupleValueType,
  TupleValueType,
  ValueType,
} from '@/app/sandbox/types/values';
import { encodeOptional, encodeOptionalTuple, encodeTuple, getTuple } from '@/app/sandbox/utils';
import { Select } from '@/common/components/Select';
import { CONNECT_AUTH_ORIGIN } from '@/common/constants/env';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { InvalidFunctionType, getInvalidFunctionType, showFn } from '@/common/utils/sandbox';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik, FormikErrors } from 'formik';
import { FC, useMemo, useState } from 'react';

import { asciiToBytes, bytesToHex } from '@stacks/common';
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

import { Alert } from '../Alert';
import { Argument } from './Argument';
import { PostConditionForm } from './PostConditionForm';
import { ReadOnlyField } from './ReadOnlyField';
import {
  PostConditionParameters,
  checkFunctionParameters,
  checkPostConditionParameters,
  getPostCondition,
  isPostConditionParameter,
} from './post-condition-utils';

interface FunctionCallFormProps {
  fnAbi: ClarityAbiFunction;
  contractId: string;
  handleCancel?: () => void;
}

interface FunctionParameters {
  [key: string]: ValueType | ListValueType;
}

export type FormikSetFieldValueFunction = (
  field: string,
  value: any,
  shouldValidate?: boolean
) => Promise<void | FormikErrors<FunctionFormikState>>;

export type FunctionFormikState = FunctionParameters & PostConditionParameters;

export const FunctionCallForm: FC<FunctionCallFormProps> = ({
  contractId,
  fnAbi,
  handleCancel,
}) => {
  const queryClient = useQueryClient();
  const network = useGlobalContext().activeNetwork;
  const [readOnlyValue, setReadonlyValue] = useState<ClarityValue[]>();
  const canUsePostConditions = fnAbi.access === 'public';

  const initialPostConditionParameterValues: PostConditionParameters = {
    postConditionMode: PostConditionMode.Allow,
    postConditionType: undefined,
    postConditionAddress: undefined,
    postConditionAmount: undefined,
    postConditionConditionCode: undefined,
    postConditionAssetName: undefined,
    postConditionAssetAddress: undefined,
    postConditionAssetContractName: undefined,
  };

  const initialFunctionParameterValues = useMemo(
    () =>
      fnAbi.args.reduce((argsAcc, arg) => {
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
      }, {} as FunctionParameters),
    [fnAbi]
  );

  if (!showFn(contractId, fnAbi)) {
    const invalidFunctionType = getInvalidFunctionType(contractId, fnAbi);
    return (
      <Alert
        title="Invalid function"
        description={
          invalidFunctionType === InvalidFunctionType.Private
            ? 'This function is private.'
            : 'This function is not valid.'
        }
        status="error"
      />
    );
  }

  if (readOnlyValue) {
    return (
      <ReadOnlyField
        fn={fnAbi}
        readOnlyValue={readOnlyValue}
        contractId={contractId}
        handleCancel={handleCancel}
      />
    );
  }

  return (
    <Formik
      initialValues={
        {
          ...initialFunctionParameterValues,
          ...initialPostConditionParameterValues,
        } as FunctionFormikState
      }
      validateOnChange={false}
      validateOnBlur={false}
      validate={values => {
        const functionParametersErrors = checkFunctionParameters(fnAbi, values);
        const postConditionParametersErrors = checkPostConditionParameters(values);
        const errors = Object.assign({}, functionParametersErrors, postConditionParametersErrors);
        return errors;
      }}
      onSubmit={async values => {
        const final: Record<string, ClarityValue> = {};

        Object.keys(values).forEach(arg => {
          if (isPostConditionParameter(arg)) {
            return;
          }
          const type = fnAbi.args.find(({ name }) => name === arg)?.type;
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
            const val =
              arg === 'memo'
                ? bytesToHex(asciiToBytes((values[arg] as NonTupleValueType).toString()))
                : values[arg];
            final[arg] = encodeOptional(optionalType, val.toString());
          } else {
            final[arg] = encodeAbiClarityValue((values[arg] as NonTupleValueType).toString(), type);
          }
        });

        const {
          postConditionMode,
          postConditionType,
          postConditionAddress,
          postConditionConditionCode,
          postConditionAmount,
          postConditionAssetAddress,
          postConditionAssetContractName,
          postConditionAssetName,
        } = values;

        if (fnAbi.access === 'public') {
          void openContractCall({
            contractAddress: contractId.split('.')[0],
            contractName: contractId.split('.')[1],
            functionName: encodeURIComponent(fnAbi.name),
            functionArgs: Object.values(final),
            network: network,
            authOrigin: CONNECT_AUTH_ORIGIN,
            onFinish: () => {
              void queryClient.invalidateQueries({ queryKey: ['addressMempoolTxsInfinite'] });
            },
            postConditions:
              values.postConditionMode === PostConditionMode.Allow
                ? undefined
                : getPostCondition({
                    postConditionType,
                    postConditionAddress,
                    postConditionConditionCode,
                    postConditionAmount,
                    postConditionAssetAddress,
                    postConditionAssetContractName,
                    postConditionAssetName,
                  }),
            postConditionMode,
          });
        } else {
          setReadonlyValue(Object.values(final));
        }
      }}
    >
      {({ handleSubmit, handleChange, values, errors, setFieldValue }) => {
        return (
          <Stack gap={6}>
            {canUsePostConditions && (
              <Stack gap={3}>
                <Flex alignItems="center" gap={2}>
                  <Text textStyle="text-regular-sm" color="textSecondary">
                    Post-conditions:
                  </Text>
                  <Select
                    defaultValue={['allow']}
                    items={[
                      {
                        value: 'allow',
                        label: 'Allow mode',
                      },
                      {
                        value: 'deny',
                        label: 'Deny mode',
                      },
                    ]}
                    onValueChange={details => {
                      const postConditionMode =
                        details.value[0] === 'allow'
                          ? PostConditionMode.Allow
                          : PostConditionMode.Deny;
                      setFieldValue('postConditionMode', postConditionMode);
                    }}
                    size="sm"
                  />
                </Flex>
                <Alert
                  status="neutral"
                  description={`In the context of post-conditions, \"allow mode\" and \"deny mode\" determine how transactions are processed when they don't exactly match the specified post-conditions. Allow mode permits transactions that satisfy the post-condition criteria, while deny mode restricts transactions to only the criteria explicitly listed in the post-conditions; anything not listed will cause the transaction to fail. Learn more about post-conditions.`}
                />
              </Stack>
            )}
            <Form onSubmit={handleSubmit}>
              <Stack gap={4}>
                {fnAbi.args.length && (
                  <>
                    {fnAbi.args.map(({ name, type }) => (
                      <Argument
                        handleChange={handleChange}
                        name={name}
                        type={type}
                        error={errors[name]}
                        key={name}
                        value={values[name]}
                      />
                    ))}
                  </>
                )}
                {canUsePostConditions && (
                  <PostConditionForm
                    values={values}
                    errors={errors}
                    formikSetFieldValue={setFieldValue}
                    handleChange={handleChange}
                  />
                )}
                <Flex alignItems="center" gap={3}>
                  <Button
                    variant="redesignPrimary"
                    type="submit"
                    onClick={e => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    Call function
                  </Button>
                  {handleCancel && (
                    <Button
                      variant="redesignWarning"
                      onClick={e => {
                        e.preventDefault();
                        handleCancel();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              </Stack>
            </Form>
          </Stack>
        );
      }}
    </Formik>
  );
};
