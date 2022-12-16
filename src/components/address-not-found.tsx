import { IconAlertOctagon, IconInfoCircle } from '@tabler/icons';
import Link from 'next/link';
import * as React from 'react';

import { Box, Grid, Stack } from '@stacks/ui';

import { Button } from '@components/button';
import { MessageWithIcon } from '@components/message-with-icon';
import { PageWrapper } from '@components/page';
import { Section } from '@components/section';
import { Title } from '@components/typography';

export const AddressNotFound: React.FC<{ isPending?: boolean }> = React.memo(({ isPending }) => {
  return (
    <>
      <Title mb={['base', 'base', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Address not found
      </Title>
      <Section mt="extra-loose">
        <Grid placeItems="center" p="extra-loose" minHeight="350px">
          <Box>
            <MessageWithIcon
              icon={IconAlertOctagon}
              title="This address doesn't seem correct."
              message="This page isn't available, and it looks like the address provided isn't correct."
              action={
                <Stack isInline spacing="base">
                  <Link href="/" passHref>
                    <Button mt="loose" as="a" display="block">
                      Go home
                    </Button>
                  </Link>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Section>
    </>
  );
});
