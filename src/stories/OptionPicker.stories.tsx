import { OptionPicker, OptionPickerOption } from '@/app/_components/NewNavBar/OptionPicker';
import { Flex, Icon } from '@chakra-ui/react';
import { Moon, SunDim } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';

const options: OptionPickerOption[] = [
  {
    id: 'light',
    label: 'Light',
    value: 'light',
    icon: props => (
      <Icon {...props}>
        <SunDim />
      </Icon>
    ),
  },
  {
    id: 'dark',
    label: 'Dark',
    value: 'dark',
    icon: props => (
      <Icon {...props}>
        <Moon />
      </Icon>
    ),
  },
];

const meta: Meta<typeof OptionPicker> = {
  title: 'Components/OptionPicker',
  component: OptionPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof OptionPicker>;

export const Default: Story = {
  args: {
    options,
    iconSize: 5,
    iconButtonHeight: 8,
    iconButtonWidth: 12,
  },
};
