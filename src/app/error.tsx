'use client';

import { Box, Grid, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { ErrorMessageLayout } from '../common/components/ErrorMessageLayout';
import { Section } from '../common/components/Section';
import { useGlobalContext } from '../common/context/useGlobalContext';
import { buildUrl } from '../common/utils/buildUrl';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { PageTitle } from './_components/PageTitle';

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
  const errorName = error.name || 'Unknown error';
  const errorMessage = error.message || 'Something went wrong, please try again later.';

  return (
    <Grid mt="32px" gap="32px" width="100%" gridTemplateColumns={['100%']}>
      <PageTitle>Stacks Explorer</PageTitle>
      <Section>
        <Grid placeItems="center" p="32px" minHeight="350px">
          <Box>
            <ErrorMessageLayout
              title={errorName}
              message={errorMessage}
              action={
                <HStack gap={4}>
                  <Box>
                    <ButtonLink
                      buttonProps={{ mt: 6 }}
                      linkProps={{ href: buildUrl('/', network) }}
                    >
                      Go home
                    </ButtonLink>
                  </Box>
                  <Box>
                    <Button onClick={() => reset()} variant="secondary" mt={6}>
                      Try again
                    </Button>
                  </Box>
                </HStack>
              }
            />
          </Box>
        </Grid>
      </Section>
    </Grid>
  );
}
