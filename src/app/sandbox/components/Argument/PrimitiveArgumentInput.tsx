import { Box } from '@chakra-ui/react';
import { FC } from 'react';

import { ClarityAbiType, getTypeString } from '@stacks/transactions';

import { Field } from '../../../../components/ui/field';
import { Input } from '../../../../ui/Input';
import { Caption } from '../../../../ui/typography';
import { CommonArgumentInputProps } from './types';

export const PrimitiveArgumentInput: FC<
  CommonArgumentInputProps & {
    type: ClarityAbiType;
    value: string;
  }
> = ({ name, type, handleChange, error, value }) => (
  <Box>
    <Field fontSize={'xs'} fontWeight="500" display="block" label={name} mb={2}>
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
        {error && <Caption color={'error'}>{error}</Caption>}
      </Box>
    </Field>
  </Box>
);
