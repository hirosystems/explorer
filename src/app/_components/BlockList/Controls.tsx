import { Flex } from '@/ui/Flex';

import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { StackProps } from '../../../ui/Stack';
import { Switch, SwitchProps } from '../../../ui/Switch';

interface ControlsProps extends StackProps {
  groupByBtc: SwitchProps;
  liveUpdates: SwitchProps;
  horizontal?: boolean;
}

export function ControlsLayout({
  liveUpdates,
  horizontal,
  children,
  ...rest
}: {
  liveUpdates?: boolean;
  horizontal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Flex
      borderBottom={liveUpdates ? '1px solid var(--stacks-colors-borderPrimary)' : 'none'}
      py={4}
      marginX={-6}
      px={6}
      direction={horizontal ? ['column', 'row'] : 'column'}
      {...rest}
    >
      {children}
    </Flex>
  );
}

export function Controls({ groupByBtc, liveUpdates, horizontal, ...rest }: ControlsProps) {
  return (
    <ControlsLayout liveUpdates={liveUpdates.isChecked} horizontal={horizontal} {...rest}>
      <FormControl display="flex" alignItems="center" gap={3} width="fit-content">
        <Switch id="group-by-btc" {...groupByBtc} />
        <FormLabel
          htmlFor="group-by-btc"
          mb="0"
          fontSize={'14px'}
          lineHeight={'1.5em'}
          fontWeight={400}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
        >
          Group by Bitcoin block
        </FormLabel>
      </FormControl>
      <FormControl display="flex" alignItems="center" gap={3}>
        <Switch id="live-updates" {...liveUpdates} />
        <FormLabel
          htmlFor="live-updates"
          mb="0"
          fontSize={'14px'}
          lineHeight={'1.5em'}
          fontWeight={400}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
        >
          Live updates
        </FormLabel>
      </FormControl>
    </ControlsLayout>
  );
}
