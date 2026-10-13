import { SectionTabsContentContainer } from '@/common/components/SectionTabs';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { Text } from '@/ui/Text';
import { Grid, Stack } from '@chakra-ui/react';

import { getTxAlert } from './Alert';
import { DetailsCard } from './DetailsCard';
import { TxHeader } from './TxHeader';
import { TxSummary } from './tx-summary/TxSummary';

export const CoinbasePage = ({ tx }: { tx: TxDetailsOf<'coinbase'> }) => {
  return (
    <>
      <Stack gap={3}>
        <TxHeader tx={tx} />
        {getTxAlert(tx)}
      </Stack>
      <Stack gap={3}>
        <Text textStyle="heading-xs">Overview</Text>

        <Grid templateColumns={{ base: '1fr', md: '75% 25%' }} gap={2}>
          <SectionTabsContentContainer>
            <TxSummary tx={tx} />
          </SectionTabsContentContainer>

          <DetailsCard tx={tx} />
        </Grid>
      </Stack>
    </>
  );
};
