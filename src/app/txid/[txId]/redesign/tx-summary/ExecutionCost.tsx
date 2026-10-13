import {
  BLOCK_EXECUTION_LIMITS,
  EXECUTION_COST_LABELS,
  calculateExecutionCostPercentage,
  formatExecutionCostPercentage,
} from '@/common/constants/execution-cost';
import { ConfirmedTxDetails } from '@/common/types/tx-v3';
import { abbreviateNumber } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import { Box, Flex, Icon, Stack, Table } from '@chakra-ui/react';
import { Question } from '@phosphor-icons/react';

import { SummaryItemLabel } from './SummaryItem';

function hasExecutionCost(cost: ConfirmedTxDetails['execution_cost'] | undefined): boolean {
  return (
    typeof cost?.read_count === 'number' &&
    typeof cost.read_length === 'number' &&
    typeof cost.runtime === 'number' &&
    typeof cost.write_count === 'number' &&
    typeof cost.write_length === 'number'
  );
}

interface ExecutionCostRowProps {
  label: string;
  value: number;
  limit: number;
}

function ExecutionCostRow({ label, value, limit }: ExecutionCostRowProps) {
  const percentage = calculateExecutionCostPercentage(value, limit);
  const formattedPercentage = formatExecutionCostPercentage(percentage);
  const formattedValue = abbreviateNumber(value);

  return (
    <Flex gap={8} alignItems="center">
      <Tooltip
        content={`${value.toLocaleString('en-US')} / ${limit.toLocaleString('en-US')}`}
        variant="redesignPrimary"
      >
        <Text textStyle="text-mono-xs" color="textSecondary" cursor="help" minW="150px">
          {label}: {formattedValue}
        </Text>
      </Tooltip>
      <Text textStyle="text-mono-xs" color="textSecondary">
        ({formattedPercentage})
      </Text>
    </Flex>
  );
}

interface ExecutionCostItemProps {
  tx: ConfirmedTxDetails;
}

export function ExecutionCostItem({ tx }: ExecutionCostItemProps) {
  const cost = tx.execution_cost;
  if (!hasExecutionCost(cost)) {
    return null;
  }

  const costMetrics = [
    {
      key: 'runtime' as const,
      value: cost.runtime,
      limit: BLOCK_EXECUTION_LIMITS.runtime,
    },
    {
      key: 'read_count' as const,
      value: cost.read_count,
      limit: BLOCK_EXECUTION_LIMITS.read_count,
    },
    {
      key: 'read_length' as const,
      value: cost.read_length,
      limit: BLOCK_EXECUTION_LIMITS.read_length,
    },
    {
      key: 'write_count' as const,
      value: cost.write_count,
      limit: BLOCK_EXECUTION_LIMITS.write_count,
    },
    {
      key: 'write_length' as const,
      value: cost.write_length,
      limit: BLOCK_EXECUTION_LIMITS.write_length,
    },
  ];

  const content = (
    <Box
      px={4}
      py={4.5}
      border="1px solid"
      borderColor="redesignBorderSecondary"
      borderRadius="redesign.sm"
      maxW="346px"
    >
      <Stack gap={3.5}>
        {costMetrics.map(({ key, value, limit }) => (
          <ExecutionCostRow
            key={key}
            label={EXECUTION_COST_LABELS[key]}
            value={value}
            limit={limit}
          />
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      <Table.Row
        hideBelow="md"
        className="group"
        bg="transparent"
        css={{
          '& > td:first-of-type': {
            borderTopLeftRadius: 'redesign.md',
            borderBottomLeftRadius: 'redesign.md',
          },
          '& > td:last-of-type': {
            borderTopRightRadius: 'redesign.md',
            borderBottomRightRadius: 'redesign.md',
          },
        }}
      >
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
          verticalAlign="top"
          pt={3}
        >
          <Flex gap={1.5} alignItems="center">
            <SummaryItemLabel label="Execution cost" />
            <Tooltip
              content="Transaction execution cost as percentage of block budget"
              variant="redesignPrimary"
            >
              <Icon h={3.5} w={3.5} color="iconTertiary">
                <Question />
              </Icon>
            </Tooltip>
          </Flex>
        </Table.Cell>
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          {content}
        </Table.Cell>
      </Table.Row>

      <Table.Row
        hideFrom="md"
        className="group"
        bg="transparent"
        css={{
          '& > td:first-of-type': {
            borderTopLeftRadius: 'redesign.md',
            borderBottomLeftRadius: 'redesign.md',
          },
          '& > td:last-of-type': {
            borderTopRightRadius: 'redesign.md',
            borderBottomRightRadius: 'redesign.md',
          },
        }}
      >
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          <Stack gap={1.5}>
            <Flex gap={1.5} alignItems="center">
              <SummaryItemLabel label="Execution cost" />
              <Tooltip
                content="Transaction execution cost as percentage of block budget"
                variant="redesignPrimary"
              >
                <Icon h={3.5} w={3.5} color="iconTertiary">
                  <Question />
                </Icon>
              </Tooltip>
            </Flex>
            {content}
          </Stack>
        </Table.Cell>
      </Table.Row>
    </>
  );
}
