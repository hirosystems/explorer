import { Input } from '@/ui/Input';
import { Field, Stack } from '@chakra-ui/react';
import { FC } from 'react';

import { ClarityAbiType, getTypeString } from '@stacks/transactions';

import { CommonArgumentInputProps } from './types';

export const PrimitiveArgumentInput: FC<
  CommonArgumentInputProps & {
    type: ClarityAbiType;
    value: string;
  }
> = ({ name, type, handleChange, error, value }) => {
  return (
    <Field.Root w="full" invalid={!!error}>
      <Stack gap={2} w="full">
        <Field.Label textStyle="text-regular-sm" color={error ? 'textError' : 'textSecondary'}>
          {name}
        </Field.Label>
        <Input
          variant="redesignPrimary"
          width="full"
          type={getTypeString(type).includes('int') ? 'number' : 'text'}
          name={name}
          id={name}
          onChange={handleChange}
          value={value}
          placeholder={`${getTypeString(type)}`}
        />
        <Field.ErrorText color={'textError'} textStyle="text-medium-xs">
          {error}
        </Field.ErrorText>
      </Stack>
    </Field.Root>
  );
};
