'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import { buildUrl } from '@/app/common/utils/buildUrl';
import { useGlobalContext } from '@/common/context/useAppContext';
import { MessageWithIcon } from '@/components/message-with-icon';
import { Meta } from '@/components/meta-head';
import { Section } from '@/components/section';
import { ButtonLink } from '@/ui/ButtonLink';
import { Box, Grid, Stack } from '@/ui/components';
import { Title } from '@/ui/typography';
import * as Sentry from '@sentry/browser';
import * as React from 'react';
import { useEffect } from 'react';
import { TbAlertOctagon } from 'react-icons/tb';

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);
  const network = useGlobalContext().activeNetwork;
  return (
    <>
      <Meta title="Transaction not found" />
      <PageTitle>Transaction not found</PageTitle>
      <Section>
        <Grid placeItems="center" p="32px" minHeight="350px">
          <Box>
            <MessageWithIcon
              icon={TbAlertOctagon}
              title="This ID doesn't seem right."
              message="This page isn't available, and it looks like the Transaction ID provided isn't correct."
              action={
                <Stack isInline spacing="16px">
                  <Box>
                    <ButtonLink href={buildUrl('/', network)} mt="24px">
                      Go home
                    </ButtonLink>
                  </Box>
                  <Box>
                    <ButtonLink
                      href={buildUrl('/transactions', network)}
                      variant="secondary"
                      mt="24px"
                    >
                      All transactions
                    </ButtonLink>
                  </Box>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Section>
    </>
  );
}
