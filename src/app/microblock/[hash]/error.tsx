'use client';

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
  return (
    <>
      <Meta title="Microblock hash not found" />
      <Title mb={['16px', '16px', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Microblock not found
      </Title>
      <Section mt="32px">
        <Grid placeItems="center" p="32px" minHeight="350px">
          <Box>
            <MessageWithIcon
              icon={TbAlertOctagon}
              title="This hash doesn't seem right."
              message="This page isn't available, and it looks like the microblock hash provided isn't correct."
              action={
                <Stack isInline spacing="16px">
                  <Box>
                    <ButtonLink href="/" mt="24px">
                      Go home
                    </ButtonLink>
                  </Box>
                  <Box>
                    <ButtonLink href="/blocks" variant="secondary" mt="24px">
                      All blocks
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
