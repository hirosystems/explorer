import { Tabs } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { Flex, FlexProps } from '../../ui/Flex';
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
    <Tabs.Root lazyMount onValueChange={({ value: index }) => setTabIndex?.(Number(index))}>
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
              <Tabs.Trigger key={`${tab.title}-title`} value={tab.title}>
                {tab.title}
              </Tabs.Trigger>
            ))}
          </Flex>
          {actions}
        </Flex>
      </Tabs.List>
      {tabs.map(tab => (
        <Tabs.Content key={`${tab.title}-content`} value={tab.title}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  </Section>
);
