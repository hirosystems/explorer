import type { Meta, StoryObj } from '@storybook/react';

import { Card } from '../common/components/Card';
import { Text } from '../ui/Text';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    padding: { control: 'text' },
    gap: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic card with text
export const Default: Story = {
  args: {
    width: '300px',
    padding: '4',
    children: <Text>This is a basic card component with some sample text content.</Text>,
  },
};
