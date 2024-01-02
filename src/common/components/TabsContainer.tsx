import { FC, ReactNode } from 'react';

import { Box } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { Stack } from '../../ui/Stack';
import { Tab } from '../../ui/Tab';
import { TabList } from '../../ui/TabList';
import { TabPanel } from '../../ui/TabPanel';
import { TabPanels } from '../../ui/TabPanels';
import { Tabs } from '../../ui/Tabs';
import { Section } from './Section';

export const TabsContainer: FC<
  {
    setTabIndex?: (index: number) => void;
    title?: string | ReactNode;
    tabs: {
      title: string;
      content: ReactNode;
    }[];
    actions?: ReactNode;
  } & FlexProps
> = ({ setTabIndex, title, tabs, actions, ...props }) => (
  <Section title={title} {...props}>
    <Tabs isLazy onChange={index => setTabIndex?.(index)}>
      <TabList flexWrap={'wrap'}>
        <Flex gap={4} width={'full'} direction={['column', 'column', 'column', 'row']}>
          <Flex width={'full'}>
            {tabs.map(tab => (
              <Tab key={`${tab.title}-title`}>{tab.title}</Tab>
            ))}
          </Flex>
          {actions}
        </Flex>
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
