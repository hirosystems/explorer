import type { Meta, StoryObj } from '@storybook/react';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../ui/Tabs';

const meta = {
  title: 'Components/Tabs',
  component: TabsRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xlg', 'xxlg'],
    },
    variant: {
      control: 'select',
      options: ['primary'],
    },
  },
  args: {
    defaultValue: 'tab-1',
    variant: 'primary',
  },
} satisfies Meta<typeof TabsRoot>;

export default meta;
type Story = StoryObj<typeof TabsRoot>;

const Template = (args: Story['args']) => (
  <TabsRoot {...args}>
    <TabsList>
      <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
      <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
    </TabsList>
    <TabsContent value="tab-1"></TabsContent>
    <TabsContent value="tab-2"></TabsContent>
    <TabsContent value="tab-3"></TabsContent>
  </TabsRoot>
);

export const Small: Story = {
  render: Template,
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  render: Template,
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  render: Template,
  args: {
    size: 'lg',
  },
};

export const XLarge: Story = {
  render: Template,
  args: {
    size: 'xlg',
  },
};

export const XXLarge: Story = {
  render: Template,
  args: {
    size: 'xxlg',
  },
};
