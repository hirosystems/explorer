import * as React from 'react';

import { Flex } from '../../../ui/Flex';
import { Section } from '../Section';
import { SkeletonBlock } from './skeleton-transaction';

export const SkeletonBlockList = () => {
  return (
    <Section title="Recent Blocks">
      <Flex flexDirection="column" flexGrow={1} data-testid="skeleton-block-list">
        {[...Array(10)].map((_, i) => (
          <SkeletonBlock key={i} />
        ))}
      </Flex>
    </Section>
  );
};
