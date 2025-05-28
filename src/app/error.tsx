'use client';

import { ErrorMessageLayout } from '@/common/components/ErrorMessageLayout';
import { Section } from '@/common/components/Section';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { Button } from '@/ui/Button';
import { DeprecatedButtonLink } from '@/ui/DeprecatedButtonLink';
import { Box, Grid, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';

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
    <Grid mt={8} gap={8} width="100%" gridTemplateColumns={['100%']}>
      <PageTitle>Stacks Explorer</PageTitle>
      <Section>
        <Grid placeItems="center" p={8} minHeight="350px">
          <Box>
            <ErrorMessageLayout
              title={errorName}
              message={errorMessage}
              action={
                <HStack gap={4} alignItems="center">
                  <DeprecatedButtonLink
                    href={buildUrl('/', network)}
                    buttonProps={{ size: 'small' }}
                  >
                    Go home
                  </DeprecatedButtonLink>
                  <Button size="small" onClick={() => reset()} variant="secondary">
                    Try again
                  </Button>
                </HStack>
              }
            />
          </Box>
        </Grid>
      </Section>
    </Grid>
  );
}
