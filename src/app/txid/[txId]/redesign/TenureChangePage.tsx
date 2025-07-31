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
        <Text textStyle="heading-xs">Overview</Text>
        <TabsContentContainer>
          <TxSummary tx={tx} />
        </TabsContentContainer>
      </Stack>
    </>
  );
};
