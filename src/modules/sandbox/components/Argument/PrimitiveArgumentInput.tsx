import React, { FC } from 'react';

import { ClarityAbiType, getTypeString } from '@stacks/transactions';
import { Box, Input, color } from '@stacks/ui';

import { Caption, Text } from '@components/typography';

import { CommonArgumentInputProps } from './types';

export const PrimitiveArgumentInput: FC<
  CommonArgumentInputProps & {
    type: ClarityAbiType;
    value: string;
  }
> = ({ name, type, handleChange, error, value }) => (
  <Box>
    <Text
      fontSize="12px"
      fontWeight="500"
      display="block"
      color={color('text-caption')}
      htmlFor={name}
      mb="tight"
    >
      {name}
    </Text>
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
      {error && <Caption color={color('feedback-error')}>{error}</Caption>}
    </Box>
  </Box>
);
