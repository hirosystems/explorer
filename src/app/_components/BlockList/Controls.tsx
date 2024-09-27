import { ReactNode } from 'react';

import { Flex, FlexProps } from '../../../ui/Flex';
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
      <FormControl display="flex" alignItems="center" gap={3} width="fit-content">
        <Switch id="group-by-btc" {...groupByBtc} />
        <FormLabel
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
        </FormLabel>
      </FormControl>
      {/*<FormControl display="flex" alignItems="center" gap={3}>*/}
      {/*  <Switch id="live-updates" {...liveUpdates} />*/}
      {/*  <FormLabel*/}
      {/*    htmlFor="live-updates"*/}
      {/*    mb="0"*/}
      {/*    mr={0}*/}
      {/*    fontSize={'14px'}*/}
      {/*    lineHeight={'1.5em'}*/}
      {/*    fontWeight={400}*/}
      {/*    textOverflow={'ellipsis'}*/}
      {/*    overflow={'hidden'}*/}
      {/*    whiteSpace={'nowrap'}*/}
      {/*  >*/}
      {/*    Live updates*/}
      {/*  </FormLabel>*/}
      {/*</FormControl>*/}
    </ControlsLayout>
  );
}
