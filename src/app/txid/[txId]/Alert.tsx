'use client';

import * as React from 'react';

import { Alert, AlertProps } from '../../../ui/Alert';
import { AlertDescription } from '../../../ui/AlertDescription';
import { AlertIcon } from '../../../ui/AlertIcon';

interface AlertError {
  name?: string;
  message?: string;
}

export function AlertBase({ status, message }: { status: AlertProps['status']; message: string }) {
  return (
    <Alert status={status} rounded={'lg'}>
      <AlertIcon />
      <AlertDescription fontSize={'sm'}>{message}</AlertDescription>
    </Alert>
  );
}
