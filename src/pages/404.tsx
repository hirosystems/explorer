import * as React from 'react';
import { NextPage } from 'next';
import { Link, Text, Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { Box, color, Flex, Grid } from '@stacks/ui';
import { Section } from '@components/section';

const PageTop: React.FC = React.memo(() => (
  <Flex flexDirection="column" alignItems="center" maxWidth="544px" justify="center">
    <Title
      as="h1"
      fontSize="36px"
      display="block"
      width="100%"
      textAlign={['center', 'left']}
      mt="72px"
      mb="extra-loose"
      color="white"
    >
      Page not found{' '}
    </Title>
  </Flex>
));
const NotFound: NextPage = () => {
  return (
    <>
      <Meta title="Not found" />
      <PageTop />
      <Section>
        <Grid placeItems="center" minHeight="450px">
          <Box>
            <Title
              mb="base"
              as="h3"
              fontSize="28px"
              textAlign="center"
              display="block"
              maxWidth="42ch"
            >
              This page is missing.
            </Title>
            <Text lineHeight="1.85" textAlign="center" display="block" maxWidth="42ch">
              Please feel free to{' '}
              <Link
                color={color('accent')}
                display="inline"
                href="https://github.com/blockstack/explorer/issues/new"
                target="_blank"
              >
                file an issue
              </Link>{' '}
              and describe: what you were attempting to do, the URL you are trying, and anything
              that is in the console.
            </Text>
          </Box>
        </Grid>
      </Section>
    </>
  );
};

export default NotFound;
