'use client';

import { Box, Input } from '@/ui/components';
import { Caption, Text } from '@/ui/typography';
import React, { FC } from 'react';

import { ClarityAbiType, getTypeString } from '@stacks/transactions';

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
      color={'textCaption'}
      as={'label'}
      htmlFor={name}
      mb="8px"
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
      {error && <Caption color={'feedbackError'}>{error}</Caption>}
    </Box>
  </Box>
);
