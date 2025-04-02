import { ListValueType, ValueType } from '@/app/sandbox/types/values';
import React from 'react';

import { ClarityAbiType } from '@stacks/transactions';

export interface ArgumentInputProps {
  type: ClarityAbiType;
  value: ValueType | ListValueType;
}

export interface CommonArgumentInputProps {
  name: string;
  handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
  error: string | undefined;
}
