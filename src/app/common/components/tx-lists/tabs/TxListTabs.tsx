import { CSVDownloadButton } from '@/components/CSVDownloadButton';
import { FilterButton } from '@/components/filter-button';
import { Box } from '@/ui/Box';
import { Tab } from '@/ui/Tab';
import { TabList } from '@/ui/TabList';
import { TabPanel } from '@/ui/TabPanel';
import { TabPanels } from '@/ui/TabPanels';
import { Tabs } from '@/ui/Tabs';
import * as React from 'react';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export const TxListTabs: FC<{
  confirmedList: ReactNode;
  mempoolList: ReactNode;
}> = ({ confirmedList, mempoolList }) => {
  const pathname = usePathname();

  const isAddressPage = React.useMemo(() => pathname?.startsWith('/address/'), [pathname]);

  return (
    <Tabs variant={'soft-rounded'} isLazy gridColumnStart={'1'} gridColumnEnd={'2'} minWidth={0}>
      <TabList>
        <Tab>Confirmed</Tab>
        <Tab>Pending</Tab>
        <Box marginLeft={'auto'} display={'flex'} gap={4}>
          {isAddressPage && <CSVDownloadButton />}
          <FilterButton />
        </Box>
      </TabList>
      <TabPanels>
        <TabPanel>{confirmedList}</TabPanel>
        <TabPanel>{mempoolList}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};
