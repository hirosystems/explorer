import * as React from 'react';
import { ReactNode } from 'react';

import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { Stack } from '../../ui/Stack';

export const TwoColumnPage: React.FC<{
  title: ReactNode;
  leftContent: ReactNode;
  rightContent: ReactNode;
}> = ({ title, leftContent, rightContent }) => {
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      {title}
      <Grid
        gridColumnGap="32px"
        gridTemplateColumns={[
          '100%',
          '100%',
          rightContent ? 'repeat(1, calc(100% - 352px) 320px)' : '100%',
        ]}
        gridRowGap={['32px', '32px', 'unset']}
        maxWidth="100%"
        alignItems="flex-start"
      >
        <Stack spacing="32px">{leftContent}</Stack>
        {rightContent && <Stack spacing="32px">{rightContent}</Stack>}
      </Grid>
    </Flex>
  );
};
