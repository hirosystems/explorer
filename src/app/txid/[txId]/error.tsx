'use client';

import { Box, Flex, Grid, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { ErrorMessageLayout } from '../../../common/components/ErrorMessageLayout';
import { Section } from '../../../common/components/Section';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { useError } from '../../../common/hooks/useError';
import { ExplorerError } from '../../../common/types/Error';
import { buildUrl } from '../../../common/utils/buildUrl';
import { DeprecatedButtonLink } from '../../../ui/DeprecatedButtonLink';
import { PageTitle } from '../../_components/PageTitle';

const defaultErrorMessage = 'Failed to fetch transaction';

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
                    <DeprecatedButtonLink href={buildUrl('/', network)} buttonLinkSize="small">
                      Go home
                    </DeprecatedButtonLink>
                  </Box>
                  <Box>
                    <DeprecatedButtonLink
                      href={buildUrl('/transactions', network)}
                      buttonLinkSize="small"
                    >
                      All transactions
                    </DeprecatedButtonLink>
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
