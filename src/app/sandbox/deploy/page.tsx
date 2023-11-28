'use client';

import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { Wrapper } from '../Wrapper';
import { LeftSection } from './LeftSection';
import { RightSection } from './RightSection';

function Deploy() {
  return (
    <Wrapper>
      <Grid minHeight="600px" gridTemplateColumns="365px 1fr" flexGrow={1} flexShrink={1}>
        <Flex flexDirection="column" flexGrow={1} p="24px">
          <LeftSection />
        </Flex>
        <Flex flexDirection="column" bg={`black`} pt="16px" flexGrow={1} flexShrink={1}>
          <RightSection />
        </Flex>
      </Grid>
    </Wrapper>
  );
}

export default Deploy;
