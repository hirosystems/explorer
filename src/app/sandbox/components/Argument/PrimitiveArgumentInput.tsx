import React, { FC } from 'react';

import { ClarityAbiType, getTypeString } from '@stacks/transactions';

import { Box } from '../../../../ui/Box';
import { Input } from '../../../../ui/Input';
import { Text } from '../../../../ui/Text';
import { Caption } from '../../../../ui/typography';
import { CommonArgumentInputProps } from './types';

export const PrimitiveArgumentInput: FC<
  CommonArgumentInputProps & {
    type: ClarityAbiType;
    value: string;
  }
> = ({ name, type, handleChange, error, value }) => (
  <Box>
    <Text fontSize="12px" fontWeight="500" display="block" as={'label'} htmlFor={name} mb="8px">
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
      {error && <Caption color={'feedbackError'}>{error}</Caption>}
    </Box>
  </Box>
);
