import * as React from 'react';
import { Box, Flex, ChevronIcon, Text } from '@blockstack/ui';
import { TransactionEvent } from '@blockstack/stacks-blockchain-sidecar-types';
import { useHover } from 'use-events';

import { Card } from '@components/card';
import { BottomButtonProps, TokenTransferProps } from '@components/token-transfer/types';
import { SectionTitle } from '@components/typography';
import { TokenTransferItem } from '@components/token-transfer/item';

const BottomButton = ({ label, icon: Icon, ...props }: BottomButtonProps) => {
  const [hover, bind] = useHover();
  return (
    <Flex
      borderBottomLeftRadius="12px"
      borderBottomRightRadius="12px"
      py="base"
      align="center"
      justify={['center', 'center', 'unset']}
      px="base-loose"
      cursor={hover ? 'pointer' : 'unset'}
      bg={hover ? 'ink.50' : 'transparent'}
      style={{
        userSelect: 'none',
      }}
      {...props}
      {...bind}
    >
      {Icon && (
        <Box color={hover ? 'ink.600' : 'ink.400'}>
          <Icon />
        </Box>
      )}
      <Text textStyle="body.small">{label}</Text>
    </Flex>
  );
};

const LoadMoreButton = (props: any) =>
  props.events.length - 1 > props.limit ? (
    <BottomButton
      icon={() => <ChevronIcon direction="down" size={6} color="currentColor" />}
      label={`${props.events.length + 1 - props.limit} more transfers`}
    />
  ) : null;

export const TokenTransfers = ({ events: _events, ...boxProps }: TokenTransferProps) => {
  if (!_events?.length) return null;

  /**
   * TODO: account for if there are many events. Limit to 5, show button if more, render more if button clicked
   */
  const limit = 5;

  // sort them by event_index
  const events = _events.slice().sort((a: TransactionEvent, b: TransactionEvent) => {
    return a.event_index - b.event_index;
  });

  return (
    <Box mt="extra-loose" {...boxProps}>
      <SectionTitle mb="base-loose">Token transfers</SectionTitle>
      <Card>
        {events.map((event: TransactionEvent, key) =>
          event ? (
            <TokenTransferItem
              noBottomBorder={
                events?.length - 1 > limit
                  ? false
                  : (key === limit - 1 && events?.length - 1 > limit) || key === events?.length - 1
              }
              data={event}
              key={key}
            />
          ) : null
        )}
        <LoadMoreButton limit={limit} events={events} />
      </Card>
    </Box>
  );
};
