'use client';

import { useParams } from 'next/navigation';
import { FC, ReactNode, useState } from 'react';

import { TabsContainer } from '../../../common/components/TabsContainer';
import { Flex, FlexProps } from '../../../ui/Flex';
import { ShowValueMenu } from '../..//txsFilterAndSort/ShowValueMenu';
import { FilterButton } from '../../txsFilterAndSort/FilterButton';
import { MempoolTxsSortMenu } from '../../txsFilterAndSort/SortMenu';
import { CSVDownloadButton } from './CSVDownloadButton';

export const TxListTabsBase: FC<
  {
    confirmedList: ReactNode;
    mempoolList: ReactNode;
    showFilterButton?: boolean;
    showValueMenu?: boolean;
  } & FlexProps
> = ({ confirmedList, mempoolList, showFilterButton = true, showValueMenu = true, ...props }) => {
  const principal = useParams().principal;
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <TabsContainer
      setTabIndex={setTabIndex}
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
        <Flex
          flexWrap={['wrap', 'wrap', 'nowrap', 'nowrap']}
          flexDirection="row"
          justifyContent={['flex-start', 'flex-start', 'flex-end', 'flex-end']}
          gap={4}
          width="auto"
        >
          {!!principal && <CSVDownloadButton address={principal as string} />}
          {tabIndex === 1 && <MempoolTxsSortMenu />}
          {showValueMenu && <ShowValueMenu />}
          {showFilterButton && <FilterButton />}
        </Flex>
      }
      {...props}
    />
  );
};
