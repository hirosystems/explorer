import { ReactNode } from 'react';
import { Grid, Stack } from '@/ui/components';

export function TwoColumnPage({
  title,
  leftContent,
  rightContent,
}: {
  title: ReactNode;
  leftContent: ReactNode;
  rightContent: ReactNode;
}) {
  return (
    <>
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
    </>
  );
}
