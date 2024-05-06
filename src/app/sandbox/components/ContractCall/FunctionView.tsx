'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { FC, ReactNode, useMemo, useState } from 'react';

import { openContractCall } from '@stacks/connect';
import {
  ClarityAbiFunction,
  ClarityValue,
  encodeAbiClarityValue,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  listCV,
} from '@stacks/transactions';

import { Section } from '../../../../common/components/Section';
import { CONNECT_AUTH_ORIGIN } from '../../../../common/constants/env';
import { useStacksNetwork } from '../../../../common/hooks/useStacksNetwork';
import { showFn } from '../../../../common/utils/sandbox';
import { validateStacksAddress } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Button } from '../../../../ui/Button';
import { Flex } from '../../../../ui/Flex';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { ListValueType, NonTupleValueType, TupleValueType, ValueType } from '../../types/values';
import { encodeOptional, encodeOptionalTuple, encodeTuple, getTuple } from '../../utils';
import { Argument } from '../Argument';
import { ReadOnlyField } from './ReadOnlyField';

interface FunctionViewProps {
  fn: ClarityAbiFunction;
  contractId: string;
  cancelButton: ReactNode;
}

type FormType = Record<string, ValueType | ListValueType>;

export const FunctionView: FC<FunctionViewProps> = ({ fn, contractId, cancelButton }) => {
  const [readOnlyValue, setReadonlyValue] = useState<ClarityValue[]>();
  const network = useStacksNetwork();
  const queryClient = useQueryClient();

  const initialValues = useMemo(
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
      initialValues={initialValues}
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
          });
        } else {
          setReadonlyValue(Object.values(final));
        }
      }}
      render={({ handleChange, values, errors }) => (
        <Section
          overflowY="auto"
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
            <Form>
              <Box p="32px">
                {fn.args.length ? (
                  <Stack mb="32px" gap={4}>
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
                  </Stack>
                ) : null}
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Button type="submit">Call function</Button>
                  {cancelButton}
                </Flex>
              </Box>
            </Form>
          )}
        </Section>
      )}
    />
  );
};
