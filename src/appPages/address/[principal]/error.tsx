import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';

import { useEffect } from 'react';
import { TbAlertOctagon } from 'react-icons/tb';
import { MessageWithIcon } from '@/components/message-with-icon';
import { Meta } from '@/components/meta-head';
import { Section } from '@/components/section';
import { ButtonLink } from '@/ui/ButtonLink';
import { Box, Grid, Stack } from '@/ui/components';
import { Title } from '@/ui/typography';

export default function Error({ error }: { error: { status: number }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    if (error.status === 404) return;
    Sentry.captureException(error);
  }, [error]);
  return (
    <>
      <Meta title="Address not found" />
      <Title mb={['16px', '16px', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Address not found
      </Title>
      <Section mt="32px">
        <Grid placeItems="center" p="32px" minHeight="350px">
          <Box>
            <MessageWithIcon
              icon={TbAlertOctagon}
              title="This address doesn't seem correct."
              message="This page isn't available, and it looks like the address provided isn't correct."
              action={
                <Stack isInline spacing="16px">
                  <Link href="/" passHref legacyBehavior>
                    <ButtonLink href="/" mt="24px">
                      Go home
                    </ButtonLink>
                  </Link>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Section>
    </>
  );
}
