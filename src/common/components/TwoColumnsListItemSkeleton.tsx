import { SkeletonText } from '@chakra-ui/react';

import { SkeletonCircle } from '../../ui/SkeletonCircle';
import { TwoColsListItem } from './TwoColumnsListItem';

export function TwoColumnsListItemSkeleton({
  icon = false,
  leftContentTitle = false,
  leftContentSubtitle = false,
  rightContentTitle = false,
  rightContentSubtitle = false,
}: {
  icon?: boolean;
  leftContentTitle?: boolean;
  leftContentSubtitle?: boolean;
  rightContentTitle?: boolean;
  rightContentSubtitle?: boolean;
}) {
  return (
    <TwoColsListItem
      icon={icon && <SkeletonCircle width={10} height={10} />}
      leftContent={{
        title: leftContentTitle ? (
          <SkeletonText noOfLines={1} skeletonHeight="1em" width={64} />
        ) : null,
        subtitle: leftContentSubtitle ? (
          <SkeletonText noOfLines={1} skeletonHeight="1em" width={80} />
        ) : null,
      }}
      rightContent={{
        title: rightContentTitle ? (
          <SkeletonText noOfLines={1} skeletonHeight="1em" width={52} />
        ) : null,
        subtitle: rightContentSubtitle ? (
          <SkeletonText noOfLines={1} skeletonHeight="1em" width={32} />
        ) : null,
      }}
    />
  );
}
