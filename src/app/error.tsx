'use client';

import { MessageWithIcon } from '@/components/message-with-icon';
import { Section } from '@/components/section';
import { Box, Grid, Stack } from '@/ui/components';
import { Title } from '@/ui/typography';
import * as Sentry from '@sentry/nextjs';
import * as React from 'react';
import { useEffect } from 'react';
import { TbAlertOctagon } from 'react-icons/tb';

export default function Error({ error, reset }: { error: any; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    if (error.status === 404) return;
    Sentry.captureException(error);
  }, [error]);
  return (
    <>
      <Title mb={['16px', '16px', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Something went wrong!
      </Title>
      <Section mt="32px">
        <Grid placeItems="center" p="32px" minHeight="350px">
          <Box>
            <MessageWithIcon
              icon={TbAlertOctagon}
              title="Something went wrong!"
              message="Try to refresh this page or try again later."
              action={
                <Stack isInline spacing="16px">
                  <Box>
                    <a href="/">Go home</a>
                  </Box>
                  <Box>
                    <button onClick={() => reset()}>Try again</button>
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
