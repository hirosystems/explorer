'use client';

import { useParams, usePathname } from 'next/navigation';
import * as React from 'react';
import { FC, ReactNode } from 'react';

import { FilterButton } from '../../../../features/txs-filter/FilterButton';
import { Box } from '../../../../ui/Box';
import { TabsProps } from '../../../../ui/Tabs';
import { TabsContainer } from '../../TabsContainer';
import { CSVDownloadButton } from './CSVDownloadButton';

export const TxListTabs: FC<
  {
    confirmedList: ReactNode;
    mempoolList: ReactNode;
  } & Partial<TabsProps>
> = ({ confirmedList, mempoolList, ...tabsProps }) => {
  const principal = useParams().principal;

  return (
    <TabsContainer
      tabs={[
        {
          title: 'Confirmed',
          content: confirmedList,
        },
        {
          title: 'Pending',
          content: mempoolList,
        },
      ]}
      actions={
        <Box marginLeft={'auto'} display={'flex'} gap={4}>
          {!!principal && <CSVDownloadButton address={principal as string} />}
          <FilterButton />
        </Box>
      }
    />
  );
};
