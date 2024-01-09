import { SkeletonCircle } from '../../ui/SkeletonCircle';
import { SkeletonItem } from '../../ui/SkeletonItem';
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
          <SkeletonItem height={'1em'} width={'50%'} display={'inline-block'} />
        ) : null,
        subtitle: leftContentSubtitle ? (
          <SkeletonItem height={'1em'} width={'80%'} display={'inline-block'} />
        ) : null,
      }}
      rightContent={{
        title: rightContentTitle ? (
          <SkeletonItem height={'1em'} width={'60%'} display={'inline-block'} />
        ) : null,
        subtitle: rightContentSubtitle ? (
          <SkeletonItem height={'1em'} width={'30%'} display={'inline-block'} />
        ) : null,
      }}
    />
  );
}
