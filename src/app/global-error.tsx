'use client';

import { useEffect } from 'react';

import { ErrorMessageLayout } from '../common/components/ErrorMessageLayout';
import { Section } from '../common/components/Section';
import { useGlobalContext } from '../common/context/useGlobalContext';
import { Box } from '../ui/Box';
import { Grid } from '../ui/Grid';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const network = useGlobalContext().activeNetwork;

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
