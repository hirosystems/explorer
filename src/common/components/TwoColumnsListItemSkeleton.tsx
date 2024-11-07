import { SkeletonCircle, SkeletonText } from '../../components/ui/skeleton';
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
      icon={icon && <SkeletonCircle w={10} height={10} />}
      leftContent={{
        title: leftContentTitle ? <SkeletonText noOfLines={1} h="1em" w={64} /> : null,
        subtitle: leftContentSubtitle ? <SkeletonText noOfLines={1} h="1em" w={80} /> : null,
      }}
      rightContent={{
        title: rightContentTitle ? <SkeletonText noOfLines={1} h="1em" w={52} /> : null,
        subtitle: rightContentSubtitle ? <SkeletonText noOfLines={1} h="1em" w={32} /> : null,
      }}
    />
  );
}
