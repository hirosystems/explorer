'use client';

import { Flex, FlexProps } from '@chakra-ui/react';
import { useParams, usePathname } from 'next/navigation';
import { FC, ReactNode, useMemo, useState } from 'react';

import { TabsContainer } from '../../../common/components/TabsContainer';
import { MempoolTxsSortMenu } from '../../txsFilterAndSort/SortMenu';
import { CSVDownloadButton } from './CSVDownloadButton';

export type TxListTab = {
  id: string;
  title: string;
  content: ReactNode;
};

export const TxListTabsBase: FC<
  {
    confirmedList: ReactNode;
    mempoolList: ReactNode;
    showFilterButton?: boolean;
    showValueMenu?: boolean;
  } & FlexProps
> = ({ confirmedList, mempoolList, showFilterButton = true, showValueMenu = true, ...props }) => {
  const tabs = useMemo(
    () => [
      {
        id: 'confirmed',
        title: 'Confirmed',
        content: confirmedList,
      },
      {
        id: 'pending',
        title: 'Pending',
        content: mempoolList,
      },
    ],
    [confirmedList, mempoolList]
  );
  const principal = useParams().principal;
  const [tabId, setTabId] = useState<string>(tabs[0].id);
  const isHomePage = usePathname() === '/';

  return (
    <TabsContainer
      tabs={tabs}
      onTabChange={setTabId}
      actions={
        <Flex
          flexWrap={['wrap', 'wrap', 'nowrap', 'nowrap']}
          flexDirection="row"
          justifyContent={['flex-start', 'flex-start', 'flex-end', 'flex-end']}
          gap={4}
          width="auto"
        >
          {!!principal && <CSVDownloadButton address={principal as string} />}
          {isHomePage && tabId === 'pending' && <MempoolTxsSortMenu />}
        </Flex>
      }
      {...props}
    />
  );
};
