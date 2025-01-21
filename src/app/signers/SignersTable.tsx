'use client';

import { Flex, Table } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode, Suspense, useCallback, useMemo, useState } from 'react';

import { CopyButton } from '../../common/components/CopyButton';
import { ExplorerLink } from '../../common/components/ExplorerLinks';
import { Section } from '../../common/components/Section';
import {
  useInfiniteQueryResult,
  useSuspenseInfiniteQueryResult,
} from '../../common/hooks/useInfiniteQueryResult';
import { truncateMiddle } from '../../common/utils/utils';
import { Text } from '../../ui/Text';
import { ScrollableBox } from '../_components/BlockList/ScrollableDiv';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { CycleFilter } from './CycleFilter';
import { removeStackingDaoFromName } from './SignerDistributionLegend';
import { SortByVotingPowerFilter, VotingPowerSortOrder } from './SortByVotingPowerFilter';
import { mobileBorderCss } from './consts';
import {
  SignerMetricsSignerForCycle,
  useSignerMetricsSignersForCycle,
} from './data/signer-metrics-hooks';
import { PoxSigner, useSuspensePoxSigners } from './data/useSigners';
import { SignersTableSkeleton } from './skeleton';
import { getSignerKeyName } from './utils';

const StyledTable = styled(Table.Root)`
  th {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const SignersTableHeader = ({
  headerTitle,
  isFirst,
}: {
  headerTitle: string;
  isFirst: boolean;
}) => (
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

export const signersTableHeaders = [
  'Signer key',
  'Entity',
  'Addresses',
  'Voting power',
  'STX stacked',
  'Latency',
  'Approved / Rejected / Missing',
];

export function formatSignerProposalMetric(metric: number): string {
  if (isNaN(metric)) return '-';
  if (metric === 0) return '0%';
  if (metric === 1) return '100%';
  return `${(metric * 100).toFixed(1)}%`;
}

export function formatSignerLatency(latencyInMs: number, missing: number): string {
  if (missing === 1 || isNaN(missing)) return '-';
  if (latencyInMs === 0) return '0s';
  return `${(latencyInMs / 1000).toFixed(2)}s`;
}

export const SignersTableHeaders = () => (
  <Table.Row>
    {signersTableHeaders.map((header, i) => (
      <SignersTableHeader
        key={`signers-table-header-${header}`}
        headerTitle={header}
        isFirst={i === 0}
      />
    ))}
  </Table.Row>
);

export function getEntityName(signerKey: string) {
  const entityName = removeStackingDaoFromName(getSignerKeyName(signerKey));
  return entityName === 'unknown' ? '-' : entityName;
}

export const SignerTableRow = ({
  index,
  isFirst,
  isLast,
  signerKey,
  votingPower,
  stxStaked,
  numStackers,
  latency,
  approved,
  rejected,
  missing,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
} & SignerRowInfo) => {
  const [isSignerKeyHovered, setIsSignerKeyHovered] = useState(false);

  return (
    <Table.Row
      style={{
        borderTop: isFirst ? 'none' : '',
        borderBottom: isLast ? 'none' : '',
      }}
    >
      <Table.Cell py={3} px={6} css={mobileBorderCss} position={'sticky'} left={0} bg="surface">
        <Flex
          gap={2}
          alignItems="center"
          onMouseEnter={() => setIsSignerKeyHovered(true)}
          onMouseLeave={() => setIsSignerKeyHovered(false)}
        >
          <ExplorerLink
            fontSize="sm"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            _hover={{ textDecoration: 'underline' }}
            href={`/signer/${signerKey}`}
          >
            <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {truncateMiddle(signerKey)}
            </Text>
          </ExplorerLink>
          <CopyButton
            initialValue={signerKey}
            aria-label={'copy signer key'}
            h={5}
            w={5}
            css={{
              opacity: isSignerKeyHovered ? 1 : 0,
              position: 'relative',
              transition: 'opacity 0.4s ease-in-out',
            }}
          />
        </Flex>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {getEntityName(signerKey)}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {numStackers}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {`${votingPower.toFixed(2)}%`}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {Number(stxStaked.toFixed(0)).toLocaleString()}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {formatSignerLatency(latency, missing)}
        </Text>
      </Table.Cell>
      <Table.Cell py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {`${formatSignerProposalMetric(approved)} / ${formatSignerProposalMetric(
            rejected
          )} / ${formatSignerProposalMetric(missing)}`}
        </Text>
      </Table.Cell>
    </Table.Row>
  );
};

export function SignersTableLayout({
  title,
  topRight,
  signersTableHeaders,
  signersTableRows,
}: {
  title: ReactNode;
  topRight?: ReactNode;
  signersTableHeaders: ReactNode;
  signersTableRows: ReactNode;
}) {
  return (
    <Section title={title} topRight={topRight}>
      <ScrollableBox>
        <StyledTable width="full">
          <Table.Header>{signersTableHeaders}</Table.Header>
          <Table.Body>{signersTableRows}</Table.Body>
        </StyledTable>
      </ScrollableBox>
    </Section>
  );
}
interface SignerRowInfo {
  signerKey: string;
  votingPower: number;
  stxStaked: number;
  numStackers: number;
  latency: number;
  approved: number;
  rejected: number;
  missing: number;
}

export function formatSignerRowData(
  signerData: PoxSigner,
  signerMetrics: SignerMetricsSignerForCycle
): SignerRowInfo {
  const totalProposals =
    signerMetrics.proposals_accepted_count +
    signerMetrics.proposals_rejected_count +
    signerMetrics.proposals_missed_count;
  return {
    signerKey: signerData.signing_key,
    votingPower: signerData.weight_percent,
    stxStaked: parseFloat(signerData.stacked_amount) / 1_000_000,
    numStackers: signerData.pooled_stacker_count + signerData.solo_stacker_count,
    latency: signerMetrics.average_response_time_ms,
    approved: signerMetrics.proposals_accepted_count / totalProposals,
    rejected: signerMetrics.proposals_rejected_count / totalProposals,
    missing: signerMetrics.proposals_missed_count / totalProposals,
  };
}

const SignersTableBase = () => {
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState(VotingPowerSortOrder.Desc);
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const [selectedCycle, setSelectedCycle] = useState<string>(currentCycleId.toString());

  const cycleFilterOnSubmitHandler = useCallback(
    (cycle: string) => {
      setSelectedCycle(cycle);
    },
    [setSelectedCycle]
  );

  const signersResponse = useSuspensePoxSigners(parseInt(selectedCycle), {
    limit: 100,
  });
  const signers = useSuspenseInfiniteQueryResult<PoxSigner>(signersResponse);

  if (!signers) {
    throw new Error('Signers data is not available');
  }

  const signersMetricsResponse = useSignerMetricsSignersForCycle(parseInt(selectedCycle), {
    limit: 100,
  });

  const signersMetrics =
    useInfiniteQueryResult<SignerMetricsSignerForCycle>(signersMetricsResponse);

  const signersData = useMemo(() => {
    return signers
      .map(signer => {
        const metrics =
          signersMetrics.find(m => m.signer_key === signer.signing_key) ||
          ({} as SignerMetricsSignerForCycle);
        return formatSignerRowData(signer, metrics);
      })
      .sort((a, b) =>
        votingPowerSortOrder === 'desc'
          ? b.votingPower - a.votingPower
          : a.votingPower - b.votingPower
      );
  }, [signers, signersMetrics, votingPowerSortOrder]);

  return (
    <SignersTableLayout
      topRight={
        <Flex gap={2} flexWrap="wrap">
          <SortByVotingPowerFilter
            setVotingPowerSortOrder={setVotingPowerSortOrder}
            votingPowerSortOrder={votingPowerSortOrder}
          />
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
            <CycleFilter onChange={cycleFilterOnSubmitHandler} defaultCycleId={selectedCycle} />
          </Flex>
        </Flex>
      }
      title={<Text fontWeight="medium">{signersData.length} Active Signers</Text>}
      signersTableHeaders={<SignersTableHeaders />}
      signersTableRows={signersData.map((signer, i) => (
        <SignerTableRow
          key={`signers-table-row-${signer.signerKey}`}
          index={i}
          {...signersData[i]}
          isFirst={i === 0}
          isLast={i === signers.length - 1}
        />
      ))}
    />
  );
};

const SignerTable = () => {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Signers',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<SignersTableSkeleton />}>
        <SignersTableBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
};

export default SignerTable;
