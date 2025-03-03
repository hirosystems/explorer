import { Icon } from '@chakra-ui/react';
import { Check, Moon, SunDim, Trash } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';

import { TabsContent, TabsLabel, TabsList, TabsRoot, TabsRootProps, TabsTrigger } from '../ui/Tabs';

interface TabsStoryProps extends TabsRootProps {
  showLabel: boolean;
}

type Story = StoryObj<TabsStoryProps>;

const meta: Meta<TabsStoryProps> = {
  title: 'Components/Tabs',
  component: TabsRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['redesignMd', 'redesignLg', 'redesignXl', 'redesign2xl'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'icons'],
    },
    showLabel: {
      control: 'boolean',
    },
  },
  args: {
    defaultValue: 'tab-1',
    variant: 'primary',
  },
};

export default meta;

const Template = (args: Story['args'] & { showLabel: boolean }) => (
  <TabsRoot variant={args.variant} size={args.size} defaultValue={args.defaultValue}>
    {args.showLabel && <TabsLabel>Label:</TabsLabel>}
    {args.variant === 'icons' ? (
      <TabsList>
        <TabsTrigger value="tab-1">
          <Icon>
            <Moon />
          </Icon>
        </TabsTrigger>
        <TabsTrigger value="tab-2">
          <Icon>
            <SunDim />
          </Icon>
        </TabsTrigger>
        <TabsTrigger value="tab-3">
          <Icon>
            <Check />
          </Icon>
        </TabsTrigger>
        <TabsTrigger value="tab-4">
          <Icon>
            <Trash />
          </Icon>
        </TabsTrigger>
      </TabsList>
    ) : (
      <TabsList>
        <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
      </TabsList>
    )}
    <TabsContent value="tab-1"></TabsContent>
    <TabsContent value="tab-2"></TabsContent>
    <TabsContent value="tab-3"></TabsContent>
  </TabsRoot>
);

export const Medium: Story = {
  render: Template,
  args: {
    size: 'redesignMd',
  },
};

export const Large: Story = {
  render: Template,
  args: {
    size: 'redesignLg',
  },
};

export const XLarge: Story = {
  render: Template,
  args: {
    size: 'redesignXl',
  },
};

export const XXLarge: Story = {
  render: Template,
  args: {
    size: 'redesign2xl',
  },
};

export const Icons: Story = {
  render: Template,
  args: {
    size: 'redesignMd',
    variant: 'icons',
  },
};
