import { FC, ReactNode } from 'react';

import { Tab } from '../../ui/Tab';
import { TabList } from '../../ui/TabList';
import { TabPanel } from '../../ui/TabPanel';
import { TabPanels } from '../../ui/TabPanels';
import { Tabs, TabsProps } from '../../ui/Tabs';

export const TabsContainer: FC<
  {
    tabs: {
      title: string;
      content: ReactNode;
    }[];
    actions?: ReactNode;
  } & Partial<TabsProps>
> = ({ tabs, actions, ...tabsProps }) => (
  <Tabs
    variant={'soft-rounded'}
    isLazy
    gridColumnStart={'1'}
    gridColumnEnd={'2'}
    minWidth={0}
    {...tabsProps}
  >
    <TabList flexWrap={'wrap'}>
      {tabs.map(tab => (
        <Tab key={`${tab.title}-title`}>{tab.title}</Tab>
      ))}
      {actions}
    </TabList>
    <TabPanels>
      {tabs.map(tab => (
        <TabPanel key={`${tab.title}-content`} height={'100%'}>
          {tab.content}
        </TabPanel>
      ))}
    </TabPanels>
  </Tabs>
);
