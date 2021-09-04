import * as React from 'react';
import { Box, Grid, GridProps, BoxProps, Stack, color } from '@stacks/ui';
import { useConnect } from '@sandbox/hooks/use-connect';
import { Button } from '@components/button';
import { border } from '@common/utils';
import { Caption, Text, Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { CodeIcon } from '@components/icons/code';
import { StxInline } from '@components/icons/stx-inline';

import FunctionIcon from 'mdi-react/FunctionIcon';
import { Section } from '@components/section';
import { IS_BROWSER } from '@common/constants';
import { useEffect, useState } from 'react';

const Item = ({ children, ...props }: GridProps) => (
  <Grid p="base" border={border()} borderRadius="8px" {...props}>
    <Stack spacing="base" isInline alignItems="center">
      {children}
    </Stack>
  </Grid>
);

const IconWrapper = (props: GridProps) => (
  <Grid color="white" bg="#9985FF" size="52px" borderRadius="100%" placeItems="center" {...props} />
);

const ItemLabel = (props: BoxProps) => (
  <Text color={color('text-title')} display="block" fontSize="18px" fontWeight="500" {...props} />
);

const ItemCaption = (props: BoxProps) => (
  <Caption fontSize="14px" lineHeight="24px" maxWidth="18ch" {...props} />
);

export const SignedOutView: React.FC<any> = () => {
  const { doOpenAuth } = useConnect();

  return (
    <>
      <Meta title="Sandbox" />
      <Section px="base" py="extra-loose">
        <Grid
          maxWidth="80%"
          mx="auto"
          gridTemplateColumns="0.75fr 1.25fr"
          columnGap="64px"
          alignItems="center"
        >
          <Box width="100%">
            <Grid
              mx="auto"
              my="extra-loose"
              rowGap="base"
              width="100%"
              alignItems="flex-start"
              justifyContent="flex-start"
              gridTemplateColumns="repeat(1, 1fr)"
            >
              <Item>
                <IconWrapper>
                  <StxInline strokeWidth={2} color="currentColor" size="22px" />
                </IconWrapper>
                <Stack spacing="tight">
                  <ItemLabel>Send STX</ItemLabel>
                  <ItemCaption>Send and receive STX with others.</ItemCaption>
                </Stack>
              </Item>
              <Item>
                <IconWrapper>
                  <CodeIcon strokeWidth={2} size="26px" />
                </IconWrapper>
                <Stack spacing="tight">
                  <ItemLabel>Contracts</ItemLabel>
                  <ItemCaption>Test and deploy your Clarity smart contracts.</ItemCaption>
                </Stack>
              </Item>
              <Item>
                <IconWrapper>
                  <FunctionIcon size="26px" />
                </IconWrapper>
                <Stack spacing="tight">
                  <ItemLabel>Call contracts</ItemLabel>
                  <ItemCaption>Call contracts and test out Stacking (PoX).</ItemCaption>
                </Stack>
              </Item>
            </Grid>
          </Box>
          <Box>
            <Title
              textAlign="left"
              as="h2"
              mt="0"
              fontSize="52px"
              lineHeight="62px"
              fontWeight="500"
              maxWidth="14ch"
            >
              Welcome to the Syvirean Explorer Sandbox!
            </Title>

            <Button onClick={doOpenAuth}>Continue with Hiro Wallet</Button>
          </Box>
        </Grid>
      </Section>
    </>
  );
};
