import { Box, HStack } from '@chakra-ui/react';
import { FC } from 'react';

import { ClarityAbiTypeTuple, getTypeString, isClarityAbiOptional } from '@stacks/transactions';

import { Field } from '../../../../components/ui/field';
import { Input } from '../../../../ui/Input';
import { Caption } from '../../../../ui/typography';
import { TupleValueType } from '../../types/values';
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
    <Box>
      <HStack id={name} gap={4} width="100%">
        {tuple.map((tupleEntry, i) => (
          <Box flexGrow={1} key={tupleEntry.name}>
            <Field
              fontSize="12px"
              fontWeight="500"
              display="block"
              label={`${name}: ${tupleEntry.name}${isOptional ? ' (optional)' : ''}`}
              mb={2}
            >
              <Box width="100%">
                <Input
                  width="100%"
                  type={getTypeString(tupleType.tuple[i].type).includes('int') ? 'number' : 'text'}
                  name={`${name}.${tupleEntry.name}`}
                  id={name}
                  onChange={handleChange}
                  value={value[tupleEntry.name]}
                  placeholder={`${getTypeString(tupleType.tuple[i].type)}`}
                />
                {error && <Caption color={'error'}>{error}</Caption>}
              </Box>
            </Field>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};
