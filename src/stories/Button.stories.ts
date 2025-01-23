import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '../ui/Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'big'] },
    variant: {
      control: 'select',
      options: ['redesignPrimary', 'redesignSecondary', 'redesignTertiary', 'redesignWarning'],
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'redesignPrimary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'redesignSecondary',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary Button',
    variant: 'redesignTertiary',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Button',
    variant: 'redesignWarning',
  },
};
