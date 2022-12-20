import { Formik } from 'formik';
import React, { FC, ReactNode, useMemo, useState } from 'react';

import { openContractCall } from '@stacks/connect';
import {
  ClarityAbiFunction,
  ClarityValue,
  encodeClarityValue,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  listCV,
} from '@stacks/transactions';
import { ClarityAbiType, ClarityAbiTypeUnion, getTypeUnion } from '@stacks/transactions';
import { Box, Button, Flex, Stack, color } from '@stacks/ui';

import { CONNECT_AUTH_ORIGIN } from '@common/constants';
import { useNetworkConfig } from '@common/hooks/use-network-config';
import { validateStacksAddress } from '@common/utils';

import { Section } from '@components/section';

import { ListValueType, NonTupleValueType, TupleValueType, ValueType } from '../../types';
import { encodeTuple, getTuple } from '../../utils';
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
  const network = useNetworkConfig();

  const initialValues = useMemo(
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
      render={({ handleSubmit, handleChange, values, errors }) => (
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
