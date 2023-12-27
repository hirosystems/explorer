'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { ErrorMessageLayout } from '../../../common/components/ErrorMessageLayout';
import { Section } from '../../../common/components/Section';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useError } from '../../../common/hooks/useError';
import { ExplorerError } from '../../../common/types/Error';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Box } from '../../../ui/Box';
import { ButtonLink } from '../../../ui/ButtonLink';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { HStack } from '../../../ui/HStack';
import { PageTitle } from '../../_components/PageTitle';

const defaultErrorMessage = 'Failed to fetch token';

export default function Error({ error }: { error: ExplorerError; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    if (error.status === 404) return;
  }, [error]);
  const network = useGlobalContext().activeNetwork;
  const { errorName, errorStatusCode, errorMessage } = useError(error, defaultErrorMessage);
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>{defaultErrorMessage}</PageTitle>
      <Section>
        <Grid placeItems="center" p="32px" minHeight="350px">
          <Box>
            <ErrorMessageLayout
              errorStatusCode={errorStatusCode}
              title={errorName}
              message={errorMessage}
              action={
                <HStack gap={4}>
                  <Box>
                    <ButtonLink href={buildUrl('/', network)} mt="24px">
                      Go home
                    </ButtonLink>
                  </Box>
                  <Box>
                    <ButtonLink href={buildUrl('/tokens', network)} variant="secondary" mt="24px">
                      All tokens
                    </ButtonLink>
                  </Box>
                </HStack>
              }
            />
          </Box>
        </Grid>
      </Section>
    </Flex>
  );
}
