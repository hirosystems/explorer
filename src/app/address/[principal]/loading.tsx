'use client';

import * as React from 'react';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { ExplorerSkeletonLoader } from '../../../common/components/loaders/skeleton-common';
import { SkeletonTransactionList } from '../../../common/components/loaders/skeleton-transaction';
import { TxListTabs } from '../../../common/components/tx-lists/tabs/TxListTabs';
import { useVerticallyStackedElementsBorderStyle } from '../../../common/hooks/useVerticallyStackedElementsBorderStyle';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Stack } from '../../../ui/Stack';
import { PageTitle } from '../../_components/PageTitle';
import { Wrapper } from './Wrapper';

export default function Loading() {
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>
        <ExplorerSkeletonLoader width={'400px'} height={'31px'} />
      </PageTitle>
      <Wrapper>
        <Stack spacing="32px">
          <Section title="Summary">
            <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
              <Box width={['100%']} css={useVerticallyStackedElementsBorderStyle}>
                <KeyValueHorizontal
                  label={'Address'}
                  value={<ExplorerSkeletonLoader width={'100px'} height={'20px'} />}
                />
                <KeyValueHorizontal
                  label={'Holdings'}
                  value={<ExplorerSkeletonLoader width={'200px'} height={'20px'} />}
                />
                <KeyValueHorizontal
                  label={'Fees'}
                  value={<ExplorerSkeletonLoader width={'150px'} height={'20px'} />}
                />
                <KeyValueHorizontal
                  label={'Last executed tx nonce'}
                  value={<ExplorerSkeletonLoader width={'200px'} height={'20px'} />}
                />
              </Box>
            </Flex>
          </Section>
          <TxListTabs
            confirmedList={<SkeletonTransactionList />}
            mempoolList={<SkeletonTransactionList />}
          />
        </Stack>
        <Stack spacing="32px">
          {/*<StxBalances principal={principal} balances={balance} />*/}
          {/*<TokenBalancesCard balances={balance} nftHoldings={nftHoldings} />*/}
        </Stack>
      </Wrapper>
    </Flex>
  );
}
