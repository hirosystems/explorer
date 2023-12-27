import { FC, ReactNode } from 'react';

import { FlexProps } from '../../ui/Flex';
import { Tab } from '../../ui/Tab';
import { TabList } from '../../ui/TabList';
import { TabPanel } from '../../ui/TabPanel';
import { TabPanels } from '../../ui/TabPanels';
import { Tabs } from '../../ui/Tabs';
import { Section } from './Section';

export const TabsContainer: FC<
  {
    title?: string | ReactNode;
    tabs: {
      title: string;
      content: ReactNode;
    }[];
    actions?: ReactNode;
  } & FlexProps
> = ({ title, tabs, actions, ...props }) => (
  <Section title={title} {...props}>
    <Tabs isLazy>
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
  </Section>
);
