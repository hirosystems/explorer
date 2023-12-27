import React, { FC } from 'react';

import { ClarityAbiTypeTuple, getTypeString, isClarityAbiOptional } from '@stacks/transactions';

import { Box } from '../../../../ui/Box';
import { HStack } from '../../../../ui/HStack';
import { Input } from '../../../../ui/Input';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
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
            <Text
              fontSize="12px"
              fontWeight="500"
              display="block"
              as={'label'}
              htmlFor={name}
              mb="8px"
            >
              ({name}): {tupleEntry.name}
              {isOptional ? ' (optional)' : ''}
            </Text>
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
              {error && <Caption color={'feedbackError'}>{error}</Caption>}
            </Box>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};
