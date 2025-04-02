import { TupleValueType } from '@/app/sandbox/types/values';
import { Input } from '@/ui/Input';
import { Field, HStack, Stack } from '@chakra-ui/react';
import { FC } from 'react';

import { ClarityAbiTypeTuple, getTypeString, isClarityAbiOptional } from '@stacks/transactions';

import { CommonArgumentInputProps } from './types';

export const TupleArgumentInput: FC<
  CommonArgumentInputProps & {
    type: ClarityAbiTypeTuple;
    value: TupleValueType;
    tuple: ClarityAbiTypeTuple['tuple'];
  }
> = ({ name, type, handleChange, error, value, tuple }) => {
  const isOptional = isClarityAbiOptional(type);
  const tupleType = isOptional ? (type.optional as ClarityAbiTypeTuple) : type;
  return (
    <Field.Root w="full" invalid={!!error}>
      <HStack id={name} gap={4} width="100%">
        {tuple.map((tupleEntry, i) => (
          <Stack gap={2} w="full">
            <Field.Label textStyle="text-regular-sm" color={error ? 'textError' : 'textSecondary'}>
              {`${name}: ${tupleEntry.name}${isOptional ? ' (optional)' : ''}`}
            </Field.Label>
            <Input
              variant="redesignPrimary"
              width="full"
              type={getTypeString(tupleType.tuple[i].type).includes('int') ? 'number' : 'text'}
              name={`${name}.${tupleEntry.name}`}
              id={`${name}.${tupleEntry.name}`}
              onChange={handleChange}
              value={value[tupleEntry.name]}
              placeholder={`${getTypeString(tupleType.tuple[i].type)}`}
            />
          </Stack>
        ))}
      </HStack>
      <Field.ErrorText color={'textError'} textStyle="text-medium-xs">
        {error}
      </Field.ErrorText>
    </Field.Root>
  );
};
