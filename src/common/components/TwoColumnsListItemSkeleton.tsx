import { Skeleton } from '../../ui/Skeleton';
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
          <Skeleton height={'1em'} width={'50%'} display={'inline-block'} />
        ) : null,
        subtitle: leftContentSubtitle ? (
          <Skeleton height={'1em'} width={'80%'} display={'inline-block'} />
        ) : null,
      }}
      rightContent={{
        title: rightContentTitle ? (
          <Skeleton height={'1em'} width={'60%'} display={'inline-block'} />
        ) : null,
        subtitle: rightContentSubtitle ? (
          <Skeleton height={'1em'} width={'30%'} display={'inline-block'} />
        ) : null,
      }}
    />
  );
}
