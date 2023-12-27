import { ReactNode } from 'react';

import { Grid } from '../../ui/Grid';

export function TowColLayout({ children }: { children: ReactNode }) {
  return (
    <Grid gap={7} gridTemplateColumns={['100%', '100%', 'minmax(0, 1fr) 320px']}>
      {children}
    </Grid>
  );
}
