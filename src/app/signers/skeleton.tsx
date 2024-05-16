'use client';

import { Card } from '../../common/components/Card';
import { Flex } from '../../ui/Flex';
import { SkeletonCircle } from '../../ui/SkeletonCircle';
import { SkeletonItem } from '../../ui/SkeletonItem';
import { SkeletonText } from '../../ui/SkeletonText';
import { Td } from '../../ui/Td';
import { Th } from '../../ui/Th';
import { Tr } from '../../ui/Tr';
import { PageTitle } from '../_components/PageTitle';
import { SkeletonStatSection } from '../_components/Stats/SkeletonStatSection';
import { SignersDistributionLayout } from './SignerDistribution';
import { SignersHeaderLayout } from './SignersHeader';
import { SignersTableLayout, signersTableHeaders } from './SignersTable';
import { VotingPowerSortOrder } from './SortByVotingPowerFilter';

const TableRowSkeleton = ({ numCols }: { numCols: number }) => {
  const cols = Array.from({ length: numCols }, (_, i) => i + 1);

  return (
    <Tr>
      {cols.map((_, index) => (
        <Td py={3} px={6} textAlign="center" key={`table-row-skeleton-${index}`}>
          <SkeletonItem width="full" height="14px" />
        </Td>
      ))}
    </Tr>
  );
};

const TableHeaderSkeleton = () => (
  <Th py={3} px={6}>
    <Flex
      bg="hoverBackground"
      px={2.5}
      py={2}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
    >
      <SkeletonText noOfLines={1} height="14px" />
    </Flex>
  </Th>
);

export const PieChartSkeleton = () => <SkeletonCircle size="150" />;

export const SignersDistributionSkeleton = () => (
  <SignersDistributionLayout
    signersDistributionPieChart={<PieChartSkeleton />}
    signersDistributionLegend={null}
  />
);

export const SignersTableSkeleton = () => {
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1);
  const numCols = Array.from({ length: signersTableHeaders.length }, (_, i) => i + 1);

  return (
    <SignersTableLayout
      numSigners={<SkeletonItem width="30%" height="40px" />}
      signersTableHeaders={
        <Tr>
          {numCols.map((_, i) => (
            <TableHeaderSkeleton key={`table-header-skeleton-${i}`} />
          ))}
        </Tr>
      }
      signersTableRows={numRows.map((_, i) => (
        <TableRowSkeleton numCols={signersTableHeaders.length} key={`table-row-skeleton-${i}`} />
      ))}
      votingPowerSortOrder={VotingPowerSortOrder.Asc}
      setVotingPowerSortOrder={() => {}}
    />
  );
};

export const SignersStatsSectionSkeleton = () => (
  <Card>
    <SkeletonStatSection />
  </Card>
);

export const SignersHeaderSkeleton = () => (
  <SignersHeaderLayout
    stackingTitle={<SkeletonItem width="30%" height="14px" />}
    currentCycleCard={<SignersStatsSectionSkeleton />}
    stxStakedCard={<SignersStatsSectionSkeleton />}
    stxLockedCard={<SignersStatsSectionSkeleton />}
    addressesStackingCard={<SignersStatsSectionSkeleton />}
    nextCycleCard={<SignersStatsSectionSkeleton />}
    signerDistribution={
      <Card height="100%" justifyContent="center" alignItems="center">
        <SkeletonCircle size="150" />
      </Card>
    }
    signerDistributionHeader={<SkeletonItem width="30%" height="14px" />}
    historicalStackingDataLink={<SkeletonItem width="30%" height="14px" />}
  />
);

export function SignersPageSkeleton() {
  return (
    <>
      <PageTitle>
        <SkeletonItem width={'400px'} height={'43px'} />
      </PageTitle>
      <SignersHeaderSkeleton />
      <SignersTableSkeleton />
    </>
  );
}
