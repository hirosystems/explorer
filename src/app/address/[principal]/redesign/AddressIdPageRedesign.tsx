import { Stack } from '@chakra-ui/react';

import { AddressHeader } from './AddressHeader';
import { AddressTabs } from './AddressTabs';

export function AddressIdPageRedesign({ principal }: { principal: string }) {
  return (
    <>
      <Stack gap={3}>
        <AddressHeader principal={principal} />
        <AddressTabs principal={principal} />
      </Stack>
    </>
  );
}
