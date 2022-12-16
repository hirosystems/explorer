import React, { FC } from 'react';

import { ClarityAbiTypeTuple, getTypeString, isClarityAbiOptional } from '@stacks/transactions';
import { Box, Input, Stack, color } from '@stacks/ui';

import { Caption, Text } from '@components/typography';

import { TupleValueType } from '../../types';
import { CommonArgumentInputProps } from './types';

export const TupleArgumentInput: FC<
  CommonArgumentInputProps & {
    type: ClarityAbiTypeTuple;
    value: TupleValueType;
    tuple: ClarityAbiTypeTuple['tuple'];
  }
> = ({ name, type, handleChange, error, value, tuple }) => {
  const isOptional = isClarityAbiOptional(type);
  return (
    <Box>
      <Stack id={name} isInline spacing="base" width="100%">
        {tuple.map((tupleEntry, i) => (
          <Box flexGrow={1} key={tupleEntry.name}>
            <Text
              fontSize="12px"
              fontWeight="500"
              display="block"
              color={color('text-caption')}
              htmlFor={name}
              mb="tight"
            >
              ({name}): {tupleEntry.name}
              {isOptional ? ' (optional)' : ''}
            </Text>
            <Box width="100%">
              <Input
                width="100%"
                type={getTypeString(type.tuple[i].type).includes('int') ? 'number' : 'text'}
                name={`${name}.${tupleEntry.name}`}
                id={name}
                onChange={handleChange}
                value={value[tupleEntry.name]}
                placeholder={`${getTypeString(type.tuple[i].type)}`}
              />
              {error && <Caption color={color('feedback-error')}>{error}</Caption>}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
