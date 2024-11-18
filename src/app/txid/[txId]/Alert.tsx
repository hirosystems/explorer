'use client';

import { Alert } from '@chakra-ui/react';

interface AlertError {
  name?: string;
  message?: string;
}

export function AlertBase({
  status,
  message,
}: {
  status: Alert.RootProps['status'];
  message: string;
}) {
  return (
    // TODO: upgrade to v3. This might be broken
    <Alert.Root status={status} rounded={'lg'}>
      <Alert.Description fontSize={'sm'}>{message}</Alert.Description>
    </Alert.Root>
  );
}
