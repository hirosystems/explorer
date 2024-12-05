import { Tabs } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { TxListTab } from '../../features/txs-list/tabs/TxListTabsBase';
import { Flex, FlexProps } from '../../ui/Flex';
import { Section } from './Section';

export const TabsContainer: FC<
  {
    setTabId: (id: string) => void;
    tabId: string;
    title?: string | ReactNode;
    tabs: TxListTab[];
    actions?: ReactNode;
  } & FlexProps
> = ({ setTabId, tabId, title, tabs, actions, ...props }) => (
  <Section title={title} {...props}>
    <Tabs.Root lazyMount onValueChange={({ value: id }) => setTabId?.(id)} value={tabId}>
      <Tabs.List width="full" border={'none'} pb={1}>
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
              <Tabs.Trigger key={`${tab.id}-title`} value={tab.id}>
                {tab.title}
              </Tabs.Trigger>
            ))}
          </Flex>
          {actions}
        </Flex>
      </Tabs.List>
      {tabs.map(tab => (
        <Tabs.Content key={`${tab.id}-content`} value={tab.id}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  </Section>
);
