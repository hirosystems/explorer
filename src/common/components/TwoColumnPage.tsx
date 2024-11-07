import { Grid, Stack } from '@chakra-ui/react';
import * as React from 'react';
import { ReactNode } from 'react';

export const TwoColumnPage: React.FC<{
  title: ReactNode;
  leftContent: ReactNode;
  rightContent: ReactNode;
}> = ({ title, leftContent, rightContent }) => {
  return (
    <>
      {title}
      <Grid gap={7} gridTemplateColumns={['100%', '100%', 'minmax(0, 1fr) 320px']}>
        <Stack gap={7}>{leftContent}</Stack>
        <Stack gap={7}>{rightContent}</Stack>
      </Grid>
    </>
  );
};
