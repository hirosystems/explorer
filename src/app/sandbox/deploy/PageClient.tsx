'use client';

import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { LeftSection } from './LeftSection';
import { RightSection } from './RightSection';

export default function Deploy() {
  return (
    <Grid gridTemplateColumns="365px minmax(0, 1fr)" flexGrow={1} flexShrink={1}>
      <Flex flexDirection="column" p={7}>
        <LeftSection />
      </Flex>
      <Flex flexDirection="column" bg={`black`} p={7}>
        <RightSection />
      </Flex>
    </Grid>
  );
}
