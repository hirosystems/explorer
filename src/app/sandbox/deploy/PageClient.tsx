'use client';

import { Grid, Stack } from '@chakra-ui/react';

import { LeftSection } from './LeftSection';
import { RightSection } from './RightSection';

export default function Deploy() {
  return (
    <Grid gridTemplateColumns="365px minmax(0, 1fr)" flexGrow={1} flexShrink={1} h="full">
      <Stack p={7}>
        <LeftSection />
      </Stack>
      <Stack bg={`black`} p={7}>
        <RightSection />
      </Stack>
    </Grid>
  );
}
