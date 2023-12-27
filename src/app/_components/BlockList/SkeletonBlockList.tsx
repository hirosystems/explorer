import * as React from 'react';

import { Section } from '../../../common/components/Section';
import { TwoColumnsListItemSkeleton } from '../../../common/components/TwoColumnsListItemSkeleton';

export const SkeletonBlockList = () => {
  return (
    <Section title="Recent Blocks">
      {[...Array(10)].map((_, i) => (
        <TwoColumnsListItemSkeleton
          key={i}
          leftContentSubtitle
          leftContentTitle
          rightContentSubtitle
          rightContentTitle
        />
      ))}
    </Section>
  );
};
