import * as React from 'react';
import { Box, Flex, ChevronIcon, Stack } from '@blockstack/ui';
import { Text } from '@components/typography';
import { TransactionEvent } from '@blockstack/stacks-blockchain-sidecar-types';
import { useHover } from 'use-events';

import { Card } from '@components/card';
import { BottomButtonProps, TokenTransferProps } from '@components/token-transfer/types';
import { Caption, SectionTitle } from '@components/typography';
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
      borderTop="1px solid var(--colors-border)"
      style={{
        userSelect: 'none',
      }}
      {...props}
      {...bind}
    >
      {Icon && (
        <Box color={hover ? 'var(--colors-text-title)' : 'var(--colors-text-caption)'}>
          <Icon />
        </Box>
      )}
      <Text
        textStyle="body.small"
        color={hover ? 'var(--colors-text-title)' : 'var(--colors-text-caption)'}
      >
        {label}
      </Text>
    </Flex>
  );
};

const LoadMoreButton = (props: any) =>
  props.events.length - 1 > props.limit && !props.viewAll ? (
    <BottomButton
      icon={() => <ChevronIcon direction="down" size={6} color="currentColor" />}
      label={`${props.events.length + 1 - props.limit} more transfers`}
      onClick={props.onClick}
    />
  ) : null;

export const TokenTransfers = ({ events: _events, ...boxProps }: TokenTransferProps) => {
  const [viewAll, setViewAll] = React.useState(false);
  if (!_events?.length) return null;

  /**
   * TODO: account for if there are many events. Limit to 5, show button if more, render more if button clicked
   */
  const limit = 4;

  // sort them by event_index
  const events = _events
    .slice(0, viewAll ? _events.length : limit)
    .sort((a: TransactionEvent, b: TransactionEvent) => {
      return a.event_index - b.event_index;
    });

  return (
    <Box {...boxProps}>
      <SectionTitle mb="base-loose">Events</SectionTitle>
      <Card>
        <Box borderBottom="1px solid var(--colors-border)">
          <Stack width="100%" isInline>
            <Flex
              pl={['base', 'base', 'none']}
              align="center"
              width="calc(33.333% - 4px)"
              flexShrink={0}
              py="base"
            >
              <Flex display={['none', 'none', 'flex']} align="center" justify="center" width="48px">
                <Caption fontSize="14px">#</Caption>
              </Flex>
              <Caption fontSize="14px">Token</Caption>
            </Flex>
            <Box width="calc(33.333% - 32px)" py="base">
              <Caption fontSize="14px">Type</Caption>
            </Box>
            <Box width="calc(33.333% + 44px)" py="base">
              <Caption fontSize="14px">Asset</Caption>
            </Box>
          </Stack>
        </Box>
        {events.map((event: TransactionEvent, key) =>
          event ? (
            <TokenTransferItem
              noBottomBorder={events?.length - 1 === key}
              data={event}
              key={key}
              length={events?.length}
            />
          ) : null
        )}
        <LoadMoreButton
          viewAll={viewAll}
          limit={limit}
          events={_events}
          onClick={() => setViewAll(true)}
        />
      </Card>
    </Box>
  );
};
