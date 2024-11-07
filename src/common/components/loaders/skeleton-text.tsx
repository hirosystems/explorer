import { Flex } from '@chakra-ui/react';

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
