import { Stack } from '@chakra-ui/react';

import { useAddressIdPageData } from '../AddressIdPageContext';
import { AddressHeader } from './AddressHeader';
import { AddressTabs } from './AddressTabs';

export function AddressIdPageRedesign({ principal }: { principal: string }) {
  const { stxPrice, initialAddressBalancesData } = useAddressIdPageData();
  // TODO: make the rest of the calls for the other tabs
  return (
    <>
      <Stack gap={3}>
        <AddressHeader principal={principal} />
        <AddressTabs principal={principal} />
      </Stack>
    </>
  );
}
