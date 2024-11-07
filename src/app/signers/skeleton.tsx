'use client';

import { Flex, Table } from '@chakra-ui/react';

import { Card } from '../../common/components/Card';
import { Skeleton, SkeletonCircle, SkeletonText } from '../../components/ui/skeleton';
import { Button } from '../../ui/Button';
import { PageTitle } from '../_components/PageTitle';
import { SkeletonStatSection } from '../_components/Stats/skeleton';
import { SignersDistributionLayout } from './SignerDistribution';
import { SignerLegendItem, SignersDistributionLegendLayout } from './SignerDistributionLegend';
import { SignersHeaderLayout } from './SignersHeader';
import { SignersMapComponentLayout } from './SignersMapComponent';
import { SignersTableLayout, signersTableHeaders } from './SignersTable';

export const TableRowSkeleton = ({ numCols }: { numCols: number }) => {
  const cols = Array.from({ length: numCols }, (_, i) => i + 1);

  return (
    <Table.Row>
      {cols.map((_, index) => (
        <Table.Cell py={3} px={6} textAlign="center" key={`table-row-skeleton-${index}`}>
          <Skeleton width="full" height="14px" />
        </Table.Cell>
      ))}
    </Table.Row>
  );
};

export const TableHeaderSkeleton = () => (
  <Table.ColumnHeader py={3} px={6}>
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
  </Table.ColumnHeader>
);

export const PieChartSkeleton = () => <SkeletonCircle size="150" />;

export const SignersTableSkeleton = () => {
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1);
  const numCols = Array.from({ length: signersTableHeaders.length }, (_, i) => i + 1);

  return (
    <SignersTableLayout
      title={<Skeleton width="30%" height="40px" />}
      signersTableHeaders={
        <Table.Row>
          {numCols.map((_, i) => (
            <TableHeaderSkeleton key={`table-header-skeleton-${i}`} />
          ))}
        </Table.Row>
      }
      signersTableRows={numRows.map((_, i) => (
        <TableRowSkeleton numCols={signersTableHeaders.length} key={`table-row-skeleton-${i}`} />
      ))}
    />
  );
};

export const SignersStatsSectionSkeleton = () => (
  <Card w={'full'}>
    <SkeletonStatSection />
  </Card>
);

const SignersMapContinentPillSkeleton = () => {
  return (
    <Button
      borderRadius="full"
      border="1px solid var(--stacks-colors-border-secondary)"
      backgroundColor={'surface'}
      onClick={() => {}}
    >
      <Skeleton height="14px" width={20} />
    </Button>
  );
};
export const SignersMapSkeleton = () => (
  <SignersMapComponentLayout
    map={<Skeleton height="100%" width="100%" borderRadius="xl" />}
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
    stackingHeader={<Skeleton width="30%" height="14px" />}
    currentCycleCard={<SignersStatsSectionSkeleton />}
    stxStakedCard={<SignersStatsSectionSkeleton />}
    nextCycleCard={<SignersStatsSectionSkeleton />}
    signerDistribution={<SignersDistributionSkeleton />}
    signerDistributionHeader={<Skeleton width="30%" height="14px" />}
    historicalStackingDataLink={<Skeleton width="30%" height="14px" />}
    signersMap={<SignersMapSkeleton />}
  />
);

export function SignersPageSkeleton() {
  return (
    <>
      <PageTitle>
        <Skeleton width={'400px'} height={'43px'} />
      </PageTitle>
      <SignersHeaderSkeleton />
      <SignersTableSkeleton />
    </>
  );
}
