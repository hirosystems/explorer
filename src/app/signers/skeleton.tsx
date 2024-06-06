'use client';

import { Button } from '@/ui/Button';

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
import { SignerLegendItem, SignersDistributionLegendLayout } from './SignerDistributionLegend';
import { SignersHeaderLayout } from './SignersHeader';
import { SignersMapComponentLayout } from './SignersMapComponent';
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

const SignersMapContinentPillSkeleton = () => {
  return (
    <Button
      borderRadius="full"
      border="1px solid var(--stacks-colors-borderSecondary)"
      backgroundColor={'surface'}
      onClick={() => {}}
    >
      <SkeletonItem  height="14px" width={20} />
    </Button>
  );
};
export const SignersMapSkeleton = () => (
  <SignersMapComponentLayout
    map={<SkeletonItem height="100%" width="100%" borderRadius="xl" />}
    pills={[...Array(3)].map((_, i) => (
      <SignersMapContinentPillSkeleton key={`signer-map-continent-pill-${i}`} />
    ))}
  />
);

export const SignersLegendItemSkeleton = () => (
  <SignerLegendItem
    signerName={<SkeletonText noOfLines={1} height="14px" width={20} />}
    signerVotingPower={<SkeletonText noOfLines={1} height="14px" width={10} />}
  />
);

export const SignersLegendSkeleton = () => (
  <SignersDistributionLegendLayout
    signersLegendItems={[...Array(10)].map((_, i) => (
      <SignersLegendItemSkeleton key={`signer-legend-item-${i}`} />
    ))}
  />
);

export const SignersDistributionSkeleton = () => (
  <SignersDistributionLayout
    signersDistributionPieChart={<PieChartSkeleton />}
    signersDistributionLegend={<SignersLegendSkeleton />}
    signersDistributionFilter={null}
  />
);

export const SignersHeaderSkeleton = () => (
  <SignersHeaderLayout
    stackingHeader={<SkeletonItem width="30%" height="14px" />}
    currentCycleCard={<SignersStatsSectionSkeleton />}
    stxStakedCard={<SignersStatsSectionSkeleton />}
    nextCycleCard={<SignersStatsSectionSkeleton />}
    signerDistribution={<SignersDistributionSkeleton />}
    signerDistributionHeader={<SkeletonItem width="30%" height="14px" />}
    historicalStackingDataLink={<SkeletonItem width="30%" height="14px" />}
    signersMap={<SignersMapSkeleton />}
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
