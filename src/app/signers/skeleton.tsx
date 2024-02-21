'use client';

import { Card } from '../../common/components/Card';
import { Flex } from '../../ui/Flex';
import { SkeletonItem } from '../../ui/SkeletonItem';
import { SkeletonText } from '../../ui/SkeletonText';
import { Td } from '../../ui/Td';
import { Th } from '../../ui/Th';
import { Tr } from '../../ui/Tr';
import { PageTitle } from '../_components/PageTitle';
import { SkeletonStatSection } from '../_components/Stats/SkeletonStatSection';
import { SignersHeaderLayout } from './SignersHeader';
import { SignersTableLayout, signersTableHeaders } from './SignersTable';

const TableRowSkeleton = ({ numCols }: { numCols: number }) => {
  const cols = Array.from({ length: numCols }, (_, i) => i + 1);

  return (
    <Tr>
      {cols.map((_, index) => (
        <Td padding="24px 12px" textAlign="center">
          <SkeletonItem width="full" height="14px" />
        </Td>
      ))}
    </Tr>
  );
};

const TableHeaderSkeleton = () => (
  <Th padding="24px 12px">
    <Flex
      bg="dropdownBgHover"
      padding="8px 10px"
      borderRadius="6px"
      justifyContent="center"
      alignItems="center"
    >
      <SkeletonText noOfLines={1} height="14px" />
    </Flex>
  </Th>
);

export default function Skeleton() {
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1); // TODO: replace with actual data
  const numCols = Array.from({ length: signersTableHeaders.length }, (_, i) => i + 1);

  return (
    <>
      <PageTitle>
        <SkeletonItem width={'400px'} height={'43px'} />
      </PageTitle>

      <SignersHeaderLayout
        title={<SkeletonItem width="30%" height="14px" />}
        currentCycleCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        stxStakedCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        stxLockedCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        addressesStackingCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        nextCycleCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        historicalStackingDataLink={<SkeletonItem width="30%" height="14px" />}
      />
      <SignersTableLayout
        numSigners={<SkeletonItem width="30%" height="40px" />}
        votingPowerSortDrodpown={<SkeletonItem width="30%" height="40px" />}
        signersTableHeaders={numCols.map(() => (
          <TableHeaderSkeleton />
        ))}
        signersTableRows={numRows.map(() => (
          <TableRowSkeleton numCols={signersTableHeaders.length} />
        ))}
      />
    </>
  );
}
