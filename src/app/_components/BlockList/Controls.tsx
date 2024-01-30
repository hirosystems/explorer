import React from 'react';

import { Flex } from '../../../ui/Flex';
import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { Stack } from '../../../ui/Stack';
import { Switch, SwitchProps } from '../../../ui/Switch';

interface ControlsProps {
  groupByBtc: SwitchProps;
  liveUpdates: SwitchProps;
  horizontal?: boolean;
}

export function Controls({ groupByBtc, liveUpdates, horizontal }: ControlsProps) {
  return (
    <>
      <Stack
        borderBottom={'1px'}
        py={4}
        marginX={-6}
        px={6}
        direction={horizontal ? ['column', 'row'] : 'column'}
      >
        <Flex justifyContent={'space-between'}>
          <FormControl display="flex" alignItems="center" gap={'12px'} minW={0}>
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
        </Flex>
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
      </Stack>
    </>
  );
}
