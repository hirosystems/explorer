import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { CSVDownloadButton } from '@/components/CSVDownloadButton';
import { FilterButton } from '@/components/filter-button';
import { Box } from '@/ui/Box';
import { TabsProps } from '@/ui/Tabs';
import { TabsContainer } from '@/appPages/common/components/TabsContainer';

export function TxListTabs({
  confirmedList,
  mempoolList,
  ...tabsProps
}: {
  confirmedList: ReactNode;
  mempoolList: ReactNode;
} & Partial<TabsProps>) {
  const pathname = usePathname();

  const isAddressPage = useMemo(() => pathname?.startsWith('/address/'), [pathname]);

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
        <Box marginLeft="auto" display="flex" gap={4}>
          {isAddressPage && <CSVDownloadButton />}
          <FilterButton />
        </Box>
      }
    />
  );
}
