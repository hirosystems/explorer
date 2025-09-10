import { Stack } from '@chakra-ui/react';

import { AddressHeader } from './AddressHeader';

export function AddressIdPageRedesign({ principal }: { principal: string }) {
  return (
    <>
      <Stack gap={3}>
        <AddressHeader principal={principal} />
      </Stack>
    </>
  );
}
