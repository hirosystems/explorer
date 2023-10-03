import dayjs from 'dayjs';
import React from 'react';
import { TbAlertTriangle, TbInfoCircle } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { Badge } from '@/common/components/Badge';
import { MODALS } from '@/common/constants';
import { useOpenedModal } from '@/components/modals/modal-slice';
import { PercentageCircle } from '@/components/percentage-circle';
import { Section } from '@/components/section';
import { addressQK, AddressQueryKeys } from '@/features/address/query-keys';
import { useAddressQueries } from '@/features/address/use-address-queries';
import { Box, BoxProps, Flex, Grid, Modal, Stack, Tooltip } from '@/ui/components';
import { Caption, Text, Title } from '@/ui/typography';

function StxAmount({ amount, ...rest }: BoxProps & { amount: number }) {
  const value = Number(Number(amount) / 10 ** 6);

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
}

function OverviewCard({
  balance,
  stacksTipHeight,
}: {
  balance?: AddressBalanceResponse;
  stacksTipHeight?: number;
}) {
  const tokenOfferingData = balance?.token_offering_locked;
  if (!tokenOfferingData) return null;
  const { total_locked, total_unlocked, unlock_schedule } = tokenOfferingData;
  const totalNumber = parseFloat(total_locked) + parseFloat(total_unlocked);
  const totalThatHasUnlocked = parseFloat(total_unlocked);
  const percentage = (totalThatHasUnlocked / totalNumber) * 100;
  const data = unlock_schedule;
  const blocksLeft = stacksTipHeight ? data[data.length - 1].block_height - stacksTipHeight : 0;

  return (
    <Section p="32px">
      <Stack spacing={0} flexWrap="wrap" isInline>
        <Stack
          width={['100%', '100%', '40%']}
          borderRight={['unset', 'unset', '1px solid']}
          borderBottom={['1px solid', '1px solid', 'unset']}
          pb={['32px', '32px', 'unset']}
        >
          <Flex alignItems="center">
            <Box mr="16px" size="44px">
              <PercentageCircle size="44px" percentage={percentage} />
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
          pt={['32px', '32px', 'unset']}
          width={['100%', '100%', '60%']}
          flexWrap={['wrap', 'wrap', 'unset']}
          isInline
        >
          <Flex
            borderRight={['unset', 'unset', '1px solid']}
            justifyContent={['flex-start', 'flex-start', 'center']}
            pb={['32px', '32px', 'unset']}
            px={['unset', 'unset', '32px']}
            width={['100%', '100%', '50%']}
            flexGrow={1}
          >
            <Stack>
              <Caption>Unlocked</Caption>
              <StxAmount color="textBody" amount={totalThatHasUnlocked} />
            </Stack>
          </Flex>
          <Flex
            pt={['32px', '32px', 'unset']}
            borderTop={['1px solid', 'unset', 'unset']}
            justifyContent={['flex-start', 'flex-start', 'center']}
            width={['100%', '100%', '50%']}
            flexGrow={1}
          >
            <Stack>
              <Caption>Locked</Caption>
              <StxAmount color="textBody" amount={parseFloat(total_locked)} />
            </Stack>
          </Flex>
        </Stack>
      </Stack>
    </Section>
  );
}

function Table({
  balance,
  stacksTipHeight,
}: {
  balance?: AddressBalanceResponse;
  stacksTipHeight?: number;
}) {
  const tokenOfferingData = balance?.token_offering_locked;
  if (!tokenOfferingData) return null;
  const { unlock_schedule } = tokenOfferingData;
  let cumulativeAmount = 0;
  return (
    <Section mt="32px" px="32px" pb="8px" pt={['8px', '8px', 'unset']}>
      <Grid
        borderBottom="1px solid"
        pb="16px"
        pt="24px"
        width="100%"
        gridTemplateColumns="16.666% 16.666% 16.666% 25% 25%"
        display={['none', 'none', 'grid']}
      >
        <Caption>Block</Caption>
        <Flex>
          <Caption>Est. Date</Caption>
          <Tooltip label="Based on average Bitcoin block time.">
            <Box size="16px" color="textCaption" ml="8px">
              <TbInfoCircle size="16px" />
            </Box>
          </Tooltip>
        </Flex>
        <Caption textAlign="center">Status</Caption>
        <Caption textAlign="right">Amount</Caption>
        <Caption textAlign="right">Cumulative</Caption>
      </Grid>
      {unlock_schedule.map(({ block_height, amount }, index, arr) => {
        const isReceived = stacksTipHeight ? block_height < stacksTipHeight : false;
        cumulativeAmount += parseFloat(amount);
        const difference = stacksTipHeight ? block_height - stacksTipHeight : 0;
        const timeInSeconds = difference * 600 * 1000;
        const now = dayjs().valueOf();
        const relativeTime = dayjs(now + timeInSeconds).format(`MMM DD 'YY`);

        return (
          <Grid
            alignItems="center"
            borderBottom={index === arr.length - 1 ? undefined : '1px solid'}
            py={['24px', '24px', '12px']}
            width="100%"
            gridTemplateColumns={[
              'repeat(1, 1fr)',
              'repeat(1, 1fr)',
              '16.666% 16.666% 16.666% 25% 25%',
            ]}
            justifyContent="flex-start"
            position="relative"
          >
            <Box fontWeight={[500, 500, 'unset']} mb={['8px', '8px', 'unset']} color="textBody">
              <Box display={['inline', 'inline', 'none']}>Block </Box>#{block_height}
            </Box>
            <Box mb={['16px', '16px', 'unset']} color="textBody">
              {relativeTime}
            </Box>
            <Flex
              justifyContent="center"
              position={['absolute', 'absolute', 'static']}
              top="24px"
              right={0}
            >
              {isReceived ? (
                <Badge bg="feedbackSuccess" border="none">
                  Received
                </Badge>
              ) : (
                <Badge color="textBody" bg="border" border="none">
                  Locked
                </Badge>
              )}
            </Flex>
            <Caption my="8px" display={['block', 'block', 'none']}>
              Amount
            </Caption>
            <StxAmount
              textAlign={['left', 'left', 'right']}
              amount={parseFloat(amount)}
              color="textBody"
            />
            <Caption my="8px" mt="16px" display={['block', 'block', 'none']}>
              Cumulative
            </Caption>
            <StxAmount
              textAlign={['left', 'left', 'right']}
              amount={cumulativeAmount}
              color="textBody"
            />
          </Grid>
        );
      })}
    </Section>
  );
}

export function UnlockingScheduleModal({ balance }: { balance?: AddressBalanceResponse }) {
  const isOpen = useOpenedModal() === MODALS.UNLOCKING_SCHEDULE;
  const queries = useAddressQueries();
  const { data: stacksInfo } = useQuery(
    addressQK(AddressQueryKeys.coreApiInfo),
    queries.fetchCoreApiInfo()
  );

  return (
    <Modal isOpen={isOpen} title="Unlocking schedule">
      <Box width="100%" maxWidth="960px" bg="bg" maxHeight="calc(100vh - 64px)" overflow="auto">
        <Stack spacing="16px">
          <Box>
            <Text fontSize="14px" color="textBody" lineHeight="22px" maxWidth="72ch">
              This address participated in the Stacks token offering. Its STX is subject to the
              unlocking schedule detailed below. The dates are estimates and can vary depending on
              the Bitcoin block time.
            </Text>
          </Box>
          <Box mt="12px" pb="32px">
            <OverviewCard balance={balance} stacksTipHeight={stacksInfo?.stacks_tip_height} />
            <Section p="16px" mt="32px">
              <Stack isInline alignItems="center">
                <Box size="18px">
                  <TbAlertTriangle color="feedbackAlert" size="18px" />
                </Box>
                <Caption>This table only shows data from after the launch of Stacks 2.0</Caption>
              </Stack>
            </Section>
            <Table balance={balance} stacksTipHeight={stacksInfo?.stacks_tip_height} />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
