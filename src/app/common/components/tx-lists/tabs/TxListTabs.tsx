import { CSVDownloadButton } from '@/components/CSVDownloadButton';
import { FilterButton } from '@/components/filter-button';
import { Box } from '@/ui/Box';
import { TabsProps } from '@/ui/Tabs';
import * as React from 'react';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TabsContainer } from '@/app/common/components/TabsContainer';

export const TxListTabs: FC<
  {
    confirmedList: ReactNode;
    mempoolList: ReactNode;
  } & Partial<TabsProps>
> = ({ confirmedList, mempoolList, ...tabsProps }) => {
  const pathname = usePathname();

  const isAddressPage = React.useMemo(() => pathname?.startsWith('/address/'), [pathname]);

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
          {isAddressPage && <CSVDownloadButton />}
          <FilterButton />
        </Box>
      }
    />
  );
};
