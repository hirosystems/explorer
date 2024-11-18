import { Field, Fieldset } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Flex, FlexProps } from '../../../ui/Flex';
import { StackProps } from '../../../ui/Stack';
import { Switch, SwitchProps } from '../../../ui/Switch';

interface ControlsProps extends StackProps {
  groupByBtc: SwitchProps;
  liveUpdates: SwitchProps;
  horizontal?: boolean;
}

export function ControlsLayout({
  horizontal,
  children,
  ...rest
}: {
  horizontal?: boolean;
  children: ReactNode;
} & FlexProps) {
  return (
    <Flex direction={horizontal ? ['column', 'row'] : 'column'} gap={3} {...rest} py={5}>
      {children}
    </Flex>
  );
}

export function Controls({ groupByBtc, liveUpdates, horizontal, ...rest }: ControlsProps) {
  return (
    <ControlsLayout horizontal={horizontal} {...rest}>
      <Fieldset.Root display="flex" alignItems="center" gap={3} width="fit-content">
        <Field.Root>
          <Field.Label
            htmlFor="group-by-btc"
            mb="0"
            mr={0}
            fontSize={'14px'}
            lineHeight={'1.5em'}
            fontWeight={400}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
          >
            Group by Bitcoin block
          </Field.Label>
          <Switch id="group-by-btc" {...groupByBtc} />
        </Field.Root>
      </Fieldset.Root>
      <Fieldset.Root display="flex" alignItems="center" gap={3}>
        <Field.Root>
          <Field.Label
            htmlFor="live-updates"
            mb="0"
            mr={0}
            fontSize={'14px'}
            lineHeight={'1.5em'}
            fontWeight={400}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
          >
            Live updates
          </Field.Label>
          <Switch id="live-updates" {...liveUpdates} />
        </Field.Root>
      </Fieldset.Root>
    </ControlsLayout>
  );
}
