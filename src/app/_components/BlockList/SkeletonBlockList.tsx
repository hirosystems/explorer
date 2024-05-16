import { Section } from '../../../common/components/Section';
import { TwoColumnsListItemSkeleton } from '../../../common/components/TwoColumnsListItemSkeleton';

export const SkeletonBlockList = () => {
  return (
    <Section title="Recent Blocks" className="skeleton-block-list-section">
      {[...Array(10)].map((_, i) => (
        <TwoColumnsListItemSkeleton key={i} leftContentTitle rightContentTitle />
      ))}
    </Section>
  );
};
