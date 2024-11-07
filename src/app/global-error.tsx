'use client';

import { Box, Grid } from '@chakra-ui/react';
import { useEffect } from 'react';

import { ErrorMessageLayout } from '../common/components/ErrorMessageLayout';
import { Section } from '../common/components/Section';
import { logError } from '../common/utils/error-utils';

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    logError(error, 'global-error');
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Section>
          <Grid placeItems="center" p={8} minHeight="350px">
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
