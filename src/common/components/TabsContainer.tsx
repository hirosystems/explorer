import { FC, ReactNode } from 'react';

import { Flex, FlexProps } from '../../ui/Flex';
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
      <TabList width="full">
        <Flex
          gap={4}
          direction={['column', 'column', 'row', 'row']}
          justifyContent={['flex-start', 'flex-start', 'space-between', 'space-between']}
          alignItems={['flex-start', 'flex-start', 'center', 'center']}
          width="full"
          flexWrap="wrap"
        >
          <Flex width={'auto'}>
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
