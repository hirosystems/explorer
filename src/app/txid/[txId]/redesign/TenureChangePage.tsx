import { ValueBasisFilterPopover } from '@/common/components/table/filters/value-basis-filter/ValueBasisFiterPopover';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';

import {
  MempoolTenureChangeTransaction,
  TenureChangeTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TenureAlert } from './Alert';
import { TxHeader } from './TxHeader';
import { TabsContentContainer } from './TxTabs';
import { TxSummary } from './tx-summary/TxSummary';

export const TenureChangePage = ({
  tx,
}: {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}) => {
  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} />
        <TenureAlert />
      </Stack>
      <Stack gap={3}>
        <Flex justifyContent={'space-between'} w="full">
          <Text textStyle="text-regular-xl">Overview</Text>
          <Flex alignItems={'center'} gap={2}>
            <Text textStyle="text-regular-sm">Show:</Text>
            <ValueBasisFilterPopover />
          </Flex>
        </Flex>
        <TabsContentContainer>
          <TxSummary tx={tx} />
        </TabsContentContainer>
      </Stack>
    </>
  );
};
