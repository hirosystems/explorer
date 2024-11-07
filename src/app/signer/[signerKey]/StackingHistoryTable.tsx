'use client';

import { Box, Flex, Table } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode, Suspense, useCallback, useMemo, useState } from 'react';

import { StackingHistoryInfo, useSignerStackingHistory } from '../../../app/signers/data/UseSigner';
import { ListFooter } from '../../../common/components/ListFooter';
import { Section } from '../../../common/components/Section';
import { Text } from '../../../ui/Text';
import { ScrollableBox } from '../../_components/BlockList/ScrollableDiv';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { CycleFilter } from '../../signers/CycleFilter';
import { formatSignerLatency } from '../../signers/SignersTable';
import { mobileBorderCss } from '../../signers/consts';
import { CycleSortFilter, CycleSortOrder } from './CycleSortFilter';
import { StackingHistoryTableSkeleton } from './skeleton';

const StyledTable = styled(Table.Root)`
  th {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Header = ({ headerTitle, isFirst }: { headerTitle: string; isFirst: boolean }) => (
  <Table.ColumnHeader
    py={3}
    px={6}
    border="none"
    css={isFirst ? mobileBorderCss : {}}
    width="fit-content"
    position={isFirst ? 'sticky' : 'unset'}
    left={0}
    bg="surface"
  >
    <Flex
      bg="hoverBackground"
      px={2.5}
      py={2}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
      width="fit-content"
    >
      <Text
        fontWeight="medium"
        whiteSpace="nowrap"
        fontSize="xs"
        color={'table.header.text'}
        textTransform="none"
        letterSpacing="normal"
      >
        {headerTitle}
      </Text>
    </Flex>
  </Table.ColumnHeader>
);

export const stackingHistoryTableHeaders = [
  'Cycle',
  'Voting power',
  'STX stacked',
  'Latency',
  'Approved',
  'Rejected',
  'Missing',
];

const Headers = () => (
  <Table.Row>
    {stackingHistoryTableHeaders.map((header, i) => (
      <Header
        key={`stacking-history-table-header-${header}`}
        headerTitle={header}
        isFirst={i === 0}
      />
    ))}
  </Table.Row>
);

const Row = ({
  isFirst,
  isLast,
  cycleid,
  votingPower,
  stxStacked,
  latency,
  approved,
  rejected,
  missing,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
} & SignerRowInfo) => {
  return (
    <Table.Row
      style={{
        borderTop: isFirst ? 'none' : '',
        borderBottom: isLast ? 'none' : '',
      }}
    >
      <Table.Cell py={3} px={6} css={mobileBorderCss} position={'sticky'} left={0} bg="surface">
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {cycleid}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {`${votingPower.toFixed(2)}%`}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {stxStacked.toFixed(0).toLocaleString()}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {formatSignerLatency(latency, missing)}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {`${(approved * 100).toFixed(2)}%`}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {`${(rejected * 100).toFixed(2)}%`}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {`${(missing * 100).toFixed(2)}%`}
        </Text>
      </Table.Cell>
    </Table.Row>
  );
};

export function StackingHistoryTableLayout({
  title,
  topRight,
  headers,
  rows,
  fetchNextPage,
  hasNextPage,
}: {
  title: ReactNode;
  topRight?: ReactNode;
  headers: ReactNode;
  rows: ReactNode;
  fetchNextPage: (() => void) | undefined;
  hasNextPage: boolean;
}) {
  return (
    <Section title={title} topRight={topRight} py={hasNextPage ? 0 : 6}>
      <ScrollableBox>
        <StyledTable width="full">
          <Table.Header>{headers}</Table.Header>
          <Table.Body>{rows}</Table.Body>
        </StyledTable>
      </ScrollableBox>
      <ListFooter
        label="cycles"
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        py={6}
        position={'sticky'}
        bottom={0}
        bg="surface"
      />
    </Section>
  );
}
interface SignerRowInfo {
  signerKey: string;
  cycleid: number;
  votingPower: number;
  stxStacked: number;
  latency: number;
  approved: number;
  rejected: number;
  missing: number;
}

function formatSignerRowData(singerInfo: StackingHistoryInfo): SignerRowInfo {
  const totalProposals =
    singerInfo.proposals_accepted_count +
    singerInfo.proposals_rejected_count +
    singerInfo.proposals_missed_count;
  return {
    signerKey: singerInfo.signer_key,
    cycleid: singerInfo.cycleid,
    votingPower: singerInfo.weight_percentage,
    stxStacked: parseFloat(singerInfo.stacked_amount) / 1_000_000,
    latency: singerInfo.average_response_time_ms,
    approved: singerInfo.proposals_accepted_count / totalProposals,
    rejected: singerInfo.proposals_rejected_count / totalProposals,
    missing: singerInfo.proposals_missed_count / totalProposals,
  };
}

const StackingHistoryTableBase = ({ signerKey }: { signerKey: string }) => {
  const [cycleSortOrder, setCycleSortOrder] = useState(CycleSortOrder.Desc);
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const [selectedCycle, setSelectedCycle] = useState<string>('');

  const cycleFilterOnSubmitHandler = useCallback(
    (cycle: string) => {
      setSelectedCycle(cycle);
    },
    [setSelectedCycle]
  );

  const { signerStackingHistory, fetchNextPage, hasNextPage } = useSignerStackingHistory(
    signerKey,
    selectedCycle
  );

  const signerData = useMemo(
    () =>
      signerStackingHistory
        .map((signer, index) => {
          return {
            ...formatSignerRowData(signer),
          };
        })
        .sort((a, b) =>
          cycleSortOrder === CycleSortOrder.Desc ? b.cycleid - a.cycleid : a.cycleid - b.cycleid
        ),
    [signerStackingHistory, cycleSortOrder]
  );

  return (
    <StackingHistoryTableLayout
      topRight={
        <Flex gap={2} flexWrap="wrap">
          <CycleSortFilter setCycleSortOrder={setCycleSortOrder} cycleSortOrder={cycleSortOrder} />
          <Flex
            gap={2}
            alignItems="center"
            border="1px solid"
            borderColor="borderPrimary"
            px={4}
            py={2}
            borderRadius="md"
            boxSizing="border-box"
            h={10}
            fontSize={'sm'}
          >
            <Text>Cycle:</Text>
            <Box h="full">
              <CycleFilter
                onChange={cycleFilterOnSubmitHandler}
                placeholder={currentCycleId.toString()}
                showOnlyInput={true}
              />
            </Box>
          </Flex>
        </Flex>
      }
      title={<Text fontWeight="medium">Stacking history</Text>}
      headers={<Headers />}
      rows={signerData.map((cycleData, i) => (
        <Row
          key={`stacking-history-table-row-${cycleData.cycleid}`}
          index={i}
          {...cycleData}
          isFirst={i === 0}
          isLast={i === signerData.length - 1}
        />
      ))}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    />
  );
};

export const StackingHistoryTable = ({ signerKey }: { signerKey: string }) => {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Stacking History',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<StackingHistoryTableSkeleton />}>
        <StackingHistoryTableBase signerKey={signerKey} />
      </Suspense>
    </ExplorerErrorBoundary>
  );
};
