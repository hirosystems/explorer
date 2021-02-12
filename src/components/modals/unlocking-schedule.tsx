import React from 'react';
import { Box, BoxProps, color, ControlledModal, Flex, Grid, IconButton, Stack } from '@stacks/ui';
import { IconAlertTriangle, IconX } from '@tabler/icons';
import { Caption, Text, Title } from '@components/typography';
import { useModal } from '@common/hooks/use-modal';
import { useUnlockingState } from '@common/hooks/use-unlocking-state';
import { MODALS } from '@common/constants';
import { Section } from '@components/section';
import { stxToMicroStx } from '@stacks/ui-utils';
import { PercentageCircle } from '@components/percentage-circle';
import { border, microToStacks } from '@common/utils';
import { Badge } from '@components/badge';

import dayjs from 'dayjs';

const StxAmount: React.FC<BoxProps & { amount: number }> = ({ amount, ...rest }) => {
  const [stx, ustx] = microToStacks(amount).toString().split('.');
  return (
    <Box {...rest}>
      <Box as="span">{stx}</Box>
      <Box opacity={0.5} as="span">
        .{ustx}
      </Box>
      <Box as="span"> STX</Box>
    </Box>
  );
};

const OverviewCard: React.FC = () => {
  const [state] = useUnlockingState();
  if (!state) return null;
  const totalNumber = state && parseFloat(state.originalTotal.replace(/,/g, ''));
  const totalThatHasUnlocked = state && stxToMicroStx(totalNumber) - state.lockedBalance;
  const percentage = totalThatHasUnlocked / totalNumber / 10000;
  const data: [height: string, amount: number][] = Object.entries(state.data);

  const blocksLeft = parseInt(data[data.length - 1][0]) - state.currentHeight;

  return (
    <Section p="extra-loose">
      <Stack isInline>
        <Stack width="50%" borderRight={border()}>
          <Flex alignItems="center">
            <Box mr="base" size="44px">
              <PercentageCircle strokeWidth={3} size="44px" percentage={percentage} />
            </Box>
            <Stack>
              <Title fontSize={3} fontWeight={400}>
                {percentage.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
                % unlocked
              </Title>
              <Caption>{blocksLeft.toLocaleString('en')} blocks remaining</Caption>
            </Stack>
          </Flex>
        </Stack>
        <Stack width="50%" isInline>
          <Flex borderRight={border()} justifyContent="center" flexGrow={1}>
            <Stack>
              <Caption>Unlocked</Caption>
              <StxAmount amount={totalThatHasUnlocked} />
            </Stack>
          </Flex>{' '}
          <Flex justifyContent="center" flexGrow={1}>
            <Stack>
              <Caption>Locked</Caption>

              <StxAmount amount={state.lockedBalance} />
            </Stack>
          </Flex>
        </Stack>
      </Stack>
    </Section>
  );
};

const Table: React.FC = () => {
  const [state] = useUnlockingState();
  if (!state) return null;
  const totalNumber = state && parseFloat(state.originalTotal.replace(/,/g, ''));
  const totalThatHasUnlocked = state && stxToMicroStx(totalNumber) - state.lockedBalance;
  const data: [height: string, amount: number][] = Object.entries(state.data);
  let cumulativeAmount = totalThatHasUnlocked;
  return (
    <Section mt="extra-loose" px="extra-loose" pb="tight">
      <Grid
        borderBottom={border()}
        pb="base"
        pt="loose"
        width="100%"
        gridTemplateColumns="repeat(5, 1fr)"
      >
        <Caption>Block</Caption>
        <Caption>Est. Date</Caption>
        <Caption>Status</Caption>
        <Caption>Amount</Caption>
        <Caption textAlign="right">Cumulative</Caption>
      </Grid>
      {data.map(([height, amount], index, arr) => {
        const isReceived = height < state.currentHeight;
        if (!isReceived) {
          cumulativeAmount += amount;
        }
        const difference = parseInt(height) - state.currentHeight;
        const timeInSeconds = difference * parseInt(state.averageBlockTime) * 1000;
        const now = dayjs().valueOf();
        const relativeTime = dayjs(now + timeInSeconds).format(`MMM DD 'YY`);

        return (
          <Grid
            alignItems="center"
            borderBottom={index === arr.length - 1 ? undefined : border()}
            py="base-tight"
            width="100%"
            gridTemplateColumns="repeat(5, 1fr)"
            justifyContent="flex-start"
          >
            <Box>#{height}</Box>
            <Box>{relativeTime}</Box>
            <Flex justifyContent="flex-start">
              {isReceived ? (
                <Badge bg={color('feedback-success')}>Received</Badge>
              ) : (
                <Badge color={color('text-body')} bg={color('border')}>
                  Locked
                </Badge>
              )}
            </Flex>
            <StxAmount amount={amount} />
            <StxAmount textAlign="right" amount={cumulativeAmount} />
          </Grid>
        );
      })}
    </Section>
  );
};

export const UnlockingScheduleModal: React.FC = () => {
  const { modal, handleCloseModal } = useModal();
  const isOpen = modal === MODALS.UNLOCKING_SCHEDULE;

  const handleClose = () => {
    handleCloseModal();
  };

  return (
    <ControlledModal
      width="100%"
      maxWidth="960px"
      bg={color('bg')}
      isOpen={isOpen}
      handleClose={handleClose}
      maxHeight="calc(100vh - 64px)"
      overflow="auto"
    >
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        p="extra-loose"
        pb="base"
      >
        <Title fontSize={4}>Unlocking schedule</Title>
        <IconButton color={color('text-caption')} onClick={handleClose} icon={IconX} />
      </Flex>
      <Stack spacing="base">
        <Box px="extra-loose">
          <Text fontSize={1} color={color('text-body')} lineHeight="22px" maxWidth="72ch">
            This address participated in the Stacks token offering. Its STX is subject to the
            unlocking schedule detailed below. The dates are estimates and can vary depending on the
            Bitcoin block time.
          </Text>
        </Box>
        <Box mt="base-tight" pb="extra-loose" px="extra-loose">
          <OverviewCard />
          <Section p="base" mt="extra-loose">
            <Stack isInline alignItems="center">
              <Box size="18px">
                <IconAlertTriangle color={color('feedback-alert')} size="18px" />
              </Box>
              <Caption>This table only shows data from after the launch of Stacks 2.0</Caption>
            </Stack>
          </Section>
          <Table />
        </Box>
      </Stack>
    </ControlledModal>
  );
};
