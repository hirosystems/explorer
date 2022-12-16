import type { NextPage } from 'next';
import React from 'react';
import { useMutation } from 'react-query';

import { Box, Grid, Stack, color } from '@stacks/ui';

import { useApi } from '@common/api/client';
import { border } from '@common/utils';

import { Badge } from '@components/badge';
import { Button, blue } from '@components/button';
import { DropIcon } from '@components/icons/drop';
import { StxInline } from '@components/icons/stx-inline';
import { Text, Title } from '@components/typography';

import { Layout } from '@modules/sandbox/components/Layout';
import { useUser } from '@modules/sandbox/hooks/useUser';

const Faucet: NextPage = () => {
  const { faucetsApi } = useApi();
  const { stxAddress } = useUser();
  const [stackingIndex, setIndex] = React.useState(0);
  const {
    mutate: runFaucetStx,
    error,
    isError,
    isSuccess,
  } = useMutation((staking?: boolean) =>
    faucetsApi.runFaucetStx({ address: stxAddress, ...(staking ? { staking: true } : {}) })
  );
  const errorMessage = isError && error instanceof Error ? error.message : '';
  const handleStackingRequest = () => {
    if (stackingIndex <= 3) {
      setIndex(i => ++i);
      if (stackingIndex === 3) {
        void runFaucetStx(true);
      }
    }
  };
  const getStackingLabel = () => {
    switch (stackingIndex) {
      case 4:
        return 'Okay, STX requested!';
      case 3:
        return 'To confirm, you actually want to do this?';
      case 2:
        return 'You can only do this once a day.';
      case 1:
        return 'Are you sure?';
      default:
        return 'I want to stack';
    }
  };
  return (
    <Layout>
      <Grid minHeight="600px" placeItems="center" flexDirection="column">
        <Box mb="base-loose">
          <Grid
            placeItems="center"
            mb="extra-loose"
            mx="auto"
            size="120px"
            border={border()}
            borderRadius="100%"
            position="relative"
            justifyContent="center"
          >
            <Grid
              placeItems="center"
              position="absolute"
              zIndex={99}
              bottom="-5px"
              left="-5px"
              size="42px"
              borderRadius="100%"
              bg={color('bg')}
            >
              <Grid placeItems="center" size="42px" borderRadius="100%" bg={blue(0.4)}>
                <DropIcon fill={color('accent')} color="blue" size="20px" />
              </Grid>
            </Grid>
            <StxInline color={color('invert')} size="48px" />
          </Grid>
          <Title mb="base" width="100%" mx="auto" fontSize="24px" textAlign="center">
            STX Faucet
          </Title>
          <Text
            mx="auto"
            width="100%"
            textAlign="center"
            color={color('text-body')}
            maxWidth="24ch"
            lineHeight="1.8"
            display="block"
            mb={0}
          >
            Need STX to test the network? The faucet can top you up!
          </Text>
          {isError ? (
            <Box
              mt="base"
              borderRadius="6px"
              bg="rgba(207,0,0,0.05)"
              border="1px solid rgba(207,0,0,0.1)"
              p="base"
              color="red"
              textAlign="center"
              lineHeight="1.8"
              wordBreak="break-all"
            >
              {errorMessage === 'Too many requests'
                ? "Sorry, you've hit your limit for today. Try again tomorrow."
                : errorMessage.includes('ConflictingNonceInMempool')
                ? 'There is a pending faucet transaction, try again soon!'
                : errorMessage}
            </Box>
          ) : null}

          {isSuccess ? (
            <Box
              mt="base"
              borderRadius="6px"
              bg={color('bg-alt')}
              border={border()}
              p="base"
              color={color('text-body')}
              textAlign="center"
            >
              <Stack justifyContent="center" isInline spacing="base">
                <Box>💰</Box>
                <Box>STX coming your way shortly!</Box>
                <Box>💰</Box>
              </Stack>
            </Box>
          ) : null}

          <Stack spacing="base" justifyContent="center" mt="base">
            <Button mx="auto" onClick={() => runFaucetStx(undefined)}>
              Request STX
            </Button>
            <Badge
              color={color('text-body')}
              mx="auto"
              border={border()}
              onClick={() => handleStackingRequest()}
              userSelect="none"
              _hover={
                stackingIndex !== 4
                  ? {
                      bg: color('bg-alt'),
                      cursor: 'pointer',
                    }
                  : {}
              }
            >
              {getStackingLabel()}
            </Badge>
          </Stack>
        </Box>
      </Grid>
    </Layout>
  );
};

export default Faucet;
