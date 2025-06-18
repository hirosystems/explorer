import { formatBlockTime } from '@/app/transactions/utils';
import { Text } from '@/ui/Text';
import { Icon, Stack, Timeline } from '@chakra-ui/react';
import { Broadcast, CheckCircle, Clock } from '@phosphor-icons/react';

import { MempoolTransaction, Transaction } from '@stacks/blockchain-api-client';

// TODO: work in progress. Do not review.
const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      borderRadius="redesign.xl"
      border="1px solid"
      borderColor="redesignBorderSecondary"
      px={5}
      pt={5}
      pb={6}
      h="fit-content"
    >
      {children}
    </Stack>
  );
};

interface Event {
  title: string;
  date?: string;
  description?: string;
  icon: React.ReactNode;
}

function getTransactionStatusTimelineEvents(tx: Transaction | MempoolTransaction): Event[] {
  const isTxInTheMempool = tx.tx_status === 'pending';

  if (isTxInTheMempool) {
    return [
      {
        title: 'Transaction broadcasted',
        date: formatBlockTime(tx.receipt_time),
        icon: (
          <Timeline.Indicator
            h={4}
            w={4}
            alignItems="center"
            justifyContent="center"
            bg="surfaceInvert"
            borderRadius="full"
          >
            <Icon h={3} w={3} color="iconInvert">
              <Broadcast />
            </Icon>
          </Timeline.Indicator>
        ),
      },
      {
        title: 'In mempool',
        icon: (
          <Timeline.Indicator
            h={4}
            w={4}
            alignItems="center"
            justifyContent="center"
            bg="feedback.bronze-600"
            borderRadius="full"
          >
            <Icon h={3} w={3} color="iconInvert">
              <Clock />
            </Icon>
          </Timeline.Indicator>
        ),
      },
    ];
  }
  return [
    {
      title: 'Confirmed',
      date: formatBlockTime((tx as Transaction).block_time),
      icon: (
        <Timeline.Indicator
          h={4}
          w={4}
          alignItems="center"
          justifyContent="center"
          bg="feedback.green-500"
          borderRadius="full"
        >
          <Icon h={3} w={3} color="iconInvert">
            <CheckCircle />
          </Icon>
        </Timeline.Indicator>
      ),
    },
    {
      title: 'Confirmed',
      date: formatBlockTime((tx as Transaction).block_time),
      icon: (
        <Timeline.Indicator
          h={4}
          w={4}
          alignItems="center"
          justifyContent="center"
          bg="feedback.green-500"
          borderRadius="full"
        >
          <Icon h={3} w={3} color="iconInvert">
            <CheckCircle />
          </Icon>
        </Timeline.Indicator>
      ),
    },
  ];
}

export const TransactionStatusTimeline = ({ tx }: { tx: Transaction }) => {
  const events = getTransactionStatusTimelineEvents(tx);

  return (
    <Container>
      <Stack gap={4}>
        <Text textStyle="text-medium-sm" color="textPrimary">
          Transaction status
        </Text>
      </Stack>
      <Timeline.Root>
        {events.map((event, index) => (
          <Timeline.Item key={index}>
            <Timeline.Connector>
              <Timeline.Separator />
              <Timeline.Indicator>{event.icon}</Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Title>{event.title}</Timeline.Title>
              {event.date && <Timeline.Description>{event.date}</Timeline.Description>}
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline.Root>
    </Container>
  );
};
