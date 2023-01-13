'use client';

import { Flex } from '@/ui/Flex';
import { Grid } from '@/ui/Grid';
import { FC } from 'react';

import { LeftSection } from './LeftSection';
import { RightSection } from './RightSection';

export const DeployPage: FC<{ claritySyntax: Record<string, any> }> = ({ claritySyntax }) => (
  <Grid minHeight="600px" gridTemplateColumns="365px 1fr" flexGrow={1} flexShrink={1}>
    <Flex flexDirection="column" flexGrow={1} p="24px">
      <LeftSection />
    </Flex>
    <Flex flexDirection="column" bg={`black`} pt="16px" flexGrow={1} flexShrink={1}>
      <RightSection claritySyntax={claritySyntax} />
    </Flex>
  </Grid>
);
