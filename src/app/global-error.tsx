'use client';

import { logError } from '@/common/utils/error-utils';
import { useEffect } from 'react';

import { ErrorMessageLayout } from '../common/components/ErrorMessageLayout';
import { Section } from '../common/components/Section';
import { Box } from '../ui/Box';
import { Grid } from '../ui/Grid';

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    logError(error, 'global-error');
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Section>
          <Grid placeItems="center" p="32px" minHeight="350px">
            <Box>
              <ErrorMessageLayout
                title="Something went wrong!"
                message="Please try again later."
                action={null}
              />
            </Box>
          </Grid>
        </Section>
      </body>
    </html>
  );
}
