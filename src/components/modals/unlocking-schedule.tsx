import React from 'react';
import { Box, BoxProps, color, ControlledModal, Flex, Grid, IconButton, Stack } from '@stacks/ui';
import { Tooltip } from '@components/tooltip';
import { IconAlertTriangle, IconInfoCircle, IconX } from '@tabler/icons';
import { Caption, Text, Title } from '@components/typography';
import { useModal } from '@common/hooks/use-modal';
import { useUnlockingState } from '@common/hooks/use-unlocking-state';
import { MODALS } from '@common/constants';
import { Section } from '@components/section';
import { stxToMicroStx } from '@stacks/ui-utils';
import { PercentageCircle } from '@components/percentage-circle';
import { border } from '@common/utils';
import { Badge } from '@components/badge';

import dayjs from 'dayjs';

const StxAmount: React.FC<BoxProps & { amount: number }> = ({ amount, ...rest }) => {
  const value = Number(Number(amount) / Math.pow(10, 6));

  const [stx, ustx] = value
    .toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })
    .split('.');
  return (
    <Box fontVariantNumeric="tabular-nums" {...rest}>
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
      <Stack spacing={0} flexWrap="wrap" isInline>
        <Stack
          width={['100%', '100%', '40%']}
          borderRight={['unset', 'unset', border()]}
          borderBottom={[border(), border(), 'unset']}
          pb={['extra-loose', 'extra-loose', 'unset']}
        >
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
        <Stack
          pt={['extra-loose', 'extra-loose', 'unset']}
          width={['100%', '100%', '60%']}
          flexWrap={['wrap', 'wrap', 'unset']}
          isInline
        >
          <Flex
            borderRight={['unset', 'unset', border()]}
            justifyContent={['flex-start', 'flex-start', 'center']}
            pb={['extra-loose', 'extra-loose', 'unset']}
            px={['unset', 'unset', 'extra-loose']}
            width={['100%', '100%', '50%']}
            flexGrow={1}
          >
            <Stack>
              <Caption>Unlocked</Caption>
              <StxAmount amount={totalThatHasUnlocked} />
            </Stack>
          </Flex>
          <Flex
            pt={['extra-loose', 'extra-loose', 'unset']}
            borderTop={[border(), 'unset', 'unset']}
            justifyContent={['flex-start', 'flex-start', 'center']}
            width={['100%', '100%', '50%']}
            flexGrow={1}
          >
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
    <Section mt="extra-loose" px="extra-loose" pb="tight" pt={['tight', 'tight', 'unset']}>
      <Grid
        borderBottom={border()}
        pb="base"
        pt="loose"
        width="100%"
        gridTemplateColumns="16.666% 16.666% 16.666% 25% 25%"
        display={['none', 'none', 'grid']}
      >
        <Caption>Block</Caption>
        <Flex>
          <Caption>Est. Date</Caption>
          <Tooltip
            labelProps={{
              textAlign: 'center',
            }}
            label="Based on average Bitcoin block time."
          >
            <Box size="16px" color={color('text-caption')} ml="tight">
              <IconInfoCircle size="16px" />
            </Box>
          </Tooltip>
        </Flex>
        <Caption textAlign="center">Status</Caption>
        <Caption textAlign="right">Amount</Caption>
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
            py={['loose', 'loose', 'base-tight']}
            width="100%"
            gridTemplateColumns={[
              'repeat(1, 1fr)',
              'repeat(1, 1fr)',
              '16.666% 16.666% 16.666% 25% 25%',
            ]}
            justifyContent="flex-start"
            position="relative"
          >
            <Box fontWeight={[500, 500, 'unset']} mb={['tight', 'tight', 'unset']}>
              <Box display={['inline', 'inline', 'none']}>Block </Box>#{height}
            </Box>
            <Box mb={['base', 'base', 'unset']}>{relativeTime}</Box>
            <Flex
              justifyContent="center"
              position={['absolute', 'absolute', 'static']}
              top="loose"
              right={0}
            >
              {isReceived ? (
                <Badge bg={color('feedback-success')}>Received</Badge>
              ) : (
                <Badge color={color('text-body')} bg={color('border')}>
                  Locked
                </Badge>
              )}
            </Flex>
            <Caption my="tight" display={['block', 'block', 'none']}>
              Amount
            </Caption>
            <StxAmount textAlign={['left', 'left', 'right']} amount={amount} />
            <Caption my="tight" mt="base" display={['block', 'block', 'none']}>
              Cumulative
            </Caption>
            <StxAmount textAlign={['left', 'left', 'right']} amount={cumulativeAmount} />
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
