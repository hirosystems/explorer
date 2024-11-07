import { Grid } from '@chakra-ui/react';
import { ReactNode } from 'react';

export function TowColLayout({ children }: { children: ReactNode }) {
  return (
    <Grid gap={7} gridTemplateColumns={['100%', '100%', 'minmax(0, 1fr) 320px']}>
      {children}
    </Grid>
  );
}
