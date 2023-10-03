'use client';

import * as Sentry from '@sentry/nextjs';

import { useEffect } from 'react';
import { TbAlertOctagon } from 'react-icons/tb';
import { MessageWithIcon } from '@/components/message-with-icon';
import { Meta } from '@/components/meta-head';
import { Section } from '@/components/section';
import { ButtonLink } from '@/ui/ButtonLink';
import { Box, Flex, Grid } from '@/ui/components';
import { Title } from '@/ui/typography';

export default function Error({ error }: { error: any }) {
  useEffect(() => {
    console.error(error);
    if (error?.status === 404) return;
    Sentry.captureException(error);
  }, [error]);
  return (
    <>
      <Meta title="Block hash not found" />
      <Title mb={['16px', '16px', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Block not found
      </Title>
      <Section mt="32px">
        <Grid placeItems="center" p="32px" minHeight="350px">
          <Box>
            <MessageWithIcon
              icon={TbAlertOctagon}
              title="This hash doesn't seem right."
              message="This page isn't available, and it looks like the block hash provided isn't correct."
              action={
                <Flex gap="16px">
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
                </Flex>
              }
            />
          </Box>
        </Grid>
      </Section>
    </>
  );
}
