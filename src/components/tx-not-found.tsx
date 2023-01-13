import { IconAlertOctagon, IconInfoCircle } from '@tabler/icons';
import Link from 'next/link';
import * as React from 'react';

import { Box, Grid, Stack } from '@stacks/ui';

import { Button } from '@components/button';
import { MessageWithIcon } from '@components/message-with-icon';
import { Section } from '@components/section';
import { Title } from '@components/typography';

export const TxNotFound: React.FC<{ isPending?: boolean }> = React.memo(({ isPending }) => {
  return (
    <>
      <Title mb={['base', 'base', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Transaction not found
      </Title>
      <Section mt="extra-loose">
        <Grid placeItems="center" p="extra-loose" minHeight="350px">
          <Box>
            {isPending ? (
              <MessageWithIcon
                icon={IconInfoCircle}
                title="Nothing here, yet..."
                message="Looks like this transaction is not currently available. If a transaction with this ID is found, the page will automatically update."
                action={
                  <Stack isInline spacing="base">
                    <Box>
                      <Link href="/" passHref>
                        <Button mt="loose" as="a" display="block">
                          Go home
                        </Button>
                      </Link>
                    </Box>

                    <Box>
                      <Link href="/transactions" passHref>
                        <Button variant="secondary" mt="loose" as="a" display="block">
                          All transactions
                        </Button>
                      </Link>
                    </Box>
                  </Stack>
                }
              />
            ) : (
              <MessageWithIcon
                icon={IconAlertOctagon}
                title="This ID doesn't seem right."
                message="This page isn't available, and it looks like the Transaction ID provided isn't correct."
                action={
                  <Stack isInline spacing="base">
                    <Box>
                      <Link href="/" passHref>
                        <Button mt="loose" as="a" display="block">
                          Go home
                        </Button>
                      </Link>
                    </Box>

                    <Box>
                      <Link href="/transactions" passHref>
                        <Button variant="secondary" mt="loose" as="a" display="block">
                          All transactions
                        </Button>
                      </Link>
                    </Box>
                  </Stack>
                }
              />
            )}
          </Box>
        </Grid>
      </Section>
    </>
  );
});