'use client';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Skeleton } from '../../../components/ui/skeleton';
import { Tr } from '../../../ui/Tr';
import { TableHeaderSkeleton, TableRowSkeleton } from '../../signers/skeleton';
import {
  AssociatedAddressListItemLayout,
  AssociatedAddressesTableLayout,
} from './AssociatedAddressesTable';
import { SignerKeyPageLayout } from './PageClient';
import { SignerKeyStat, SignerStatsLayout } from './SignerStats';
import { SignerSummaryLayout } from './SignerSummary';
import { StackingHistoryTableLayout, stackingHistoryTableHeaders } from './StackingHistoryTable';

export const SignerKeyStatsSkeleton = () => {
  return (
    <SignerStatsLayout>
      <SignerKeyStat label={<Skeleton h={5} w="100%" />} value={<Skeleton h={5} w="100%" />} />
      <SignerKeyStat label={<Skeleton h={5} w="100%" />} value={<Skeleton h={5} w="100%" />} />
      <SignerKeyStat label={<Skeleton h={5} w="100%" />} value={<Skeleton h={5} w="100%" />} />
      <SignerKeyStat label={<Skeleton h={5} w="100%" />} value={<Skeleton h={5} w="100%" />} />
    </SignerStatsLayout>
  );
};
export const StackingHistoryTableSkeleton = () => {
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1);
  const numCols = Array.from({ length: stackingHistoryTableHeaders.length }, (_, i) => i + 1);

  return (
    <StackingHistoryTableLayout
      title="Stacking history"
      headers={
        <Tr>
          {numCols.map((_, i) => (
            <TableHeaderSkeleton key={`table-header-skeleton-${i}`} />
          ))}
        </Tr>
      }
      rows={numRows.map((_, i) => (
        <TableRowSkeleton
          numCols={stackingHistoryTableHeaders.length}
          key={`table-row-skeleton-${i}`}
        />
      ))}
      fetchNextPage={undefined}
      hasNextPage={false}
    />
  );
};

export const AssociatedAddressesTableSkeleton = () => {
  return (
    <AssociatedAddressesTableLayout
      addresses={Array.from({ length: 10 }, (_, i) => (
        <AssociatedAddressListItemLayout isLast={i === 9} key={`associated-address-skeleton-${i}`}>
          <Skeleton h={5} w="100%" />
        </AssociatedAddressListItemLayout>
      ))}
      footer={null}
    />
  );
};

export const SignerSummarySkeleton = () => {
  return (
    <SignerSummaryLayout>
      {Array.from({ length: 5 }, (_, i) => (
        <KeyValueHorizontal
          key={`key-value-horizontal-skeleton-${i}`}
          label={<Skeleton h={4} w={20} />}
          value={<Skeleton h={4} w={40} />}
        />
      ))}
    </SignerSummaryLayout>
  );
};

export const SignerKeyPageSkeleton = () => {
  return (
    <SignerKeyPageLayout
      signerSummary={<SignerSummarySkeleton />}
      associatedAddressesTable={<AssociatedAddressesTableSkeleton />}
      stackingHistoryTable={<StackingHistoryTableSkeleton />}
      signerStats={<SignerKeyStatsSkeleton />}
    />
  );
};
