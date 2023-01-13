import React from 'react';

import { ClarityAbiType } from '@stacks/transactions';

import { ListValueType, ValueType } from '../../types/values';

export interface ArgumentInputProps {
  type: ClarityAbiType;
  value: ValueType | ListValueType;
}

export interface CommonArgumentInputProps {
  name: string;
  handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
  error: any;
}
