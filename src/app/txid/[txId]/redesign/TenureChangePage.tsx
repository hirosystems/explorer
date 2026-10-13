import { SectionTabsContentContainer } from '@/common/components/SectionTabs';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';

import { getTxAlert } from './Alert';
import { TxHeader } from './TxHeader';
import { TxSummary } from './tx-summary/TxSummary';

export const TenureChangePage = ({ tx }: { tx: TxDetailsOf<'tenure_change'> }) => {
  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} />
        {getTxAlert(tx)}
      </Stack>
      <Stack gap={3}>
        <Text textStyle="heading-xs">Overview</Text>
        <SectionTabsContentContainer>
          <TxSummary tx={tx} />
        </SectionTabsContentContainer>
      </Stack>
    </>
  );
};
