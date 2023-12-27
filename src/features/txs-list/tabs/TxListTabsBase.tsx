'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';
import { FC, ReactNode } from 'react';

import { TabsContainer } from '../../../common/components/TabsContainer';
import { Box } from '../../../ui/Box';
import { FlexProps } from '../../../ui/Flex';
import { FilterButton } from '../../txs-filter/FilterButton';
import { CSVDownloadButton } from './CSVDownloadButton';

export const TxListTabsBase: FC<
  {
    confirmedList: ReactNode;
    mempoolList: ReactNode;
  } & FlexProps
> = ({ confirmedList, mempoolList, ...props }) => {
  const principal = useParams().principal;

  return (
    <TabsContainer
      title={'Recent transactions'}
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
      {...props}
    />
  );
};
