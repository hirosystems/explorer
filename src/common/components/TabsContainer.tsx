import { Flex, FlexProps, Tabs } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { TxListTab } from '../../features/txs-list/tabs/TxListTabsBase';
import { Section } from './Section';

export const TabsContainer: FC<
  {
    tabs: TxListTab[];
    onTabChange?: (id: string) => void;
    title?: string | ReactNode;
    actions?: ReactNode;
  } & FlexProps
> = ({ onTabChange, title, tabs, actions, ...props }) => {
  return (
    <Section title={title} {...props}>
      <Tabs.Root
        lazyMount
        onValueChange={({ value: id }) => {
          onTabChange?.(id);
        }}
        defaultValue={tabs[0].id}
      >
        <Tabs.List width="full" border={'none'} pb={1}>
          <Flex
            gap={4}
            direction={['column', 'column', 'row', 'row']}
            justifyContent={['flex-start', 'flex-start', 'space-between', 'space-between']}
            alignItems={['flex-start', 'flex-start', 'center', 'center']}
            width="full"
          >
            <Flex width={'auto'} flexWrap={'wrap'}>
              {tabs.map(tab => (
                <Tabs.Trigger key={`${tab.id}-title`} value={tab.id} w="max-content">
                  {tab.title}
                </Tabs.Trigger>
              ))}
            </Flex>
            {actions}
          </Flex>
        </Tabs.List>
        {tabs.map(tab => (
          <Tabs.Content key={`${tab.id}-content`} value={tab.id} h="full">
            {tab.content}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Section>
  );
};
