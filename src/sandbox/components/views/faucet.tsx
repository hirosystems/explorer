// @ts-nocheck
import React from 'react';
import { Box, color, Grid, Stack } from '@stacks/ui';
import { blue, Button } from '@components/button';
import { Text, Title } from '@components/typography';
import { postToSidecar } from '@common/api/fetch';
import { useApiServer } from '@common/hooks/use-api';

import { border } from '@common/utils';
import { StxInline } from '@components/icons/stx-inline';
import { useUser } from '@sandbox/hooks/use-user';
import { DropIcon } from '@components/icons/drop';
import { Badge } from '@components/badge';
import { useRecoilState } from 'recoil';
import { faucetResponseState } from '@sandbox/store/sandbox';

export const FaucetView = () => {
  const apiServer = useApiServer();
  const { principal } = useUser();
  const [response, setResponse] = useRecoilState(faucetResponseState);
  const { refreshPendingTransactions } = useUser();
  const [stackingIndex, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (response) {
      setResponse(undefined);
    }
    return () => setResponse(undefined);
  }, []);

  const handleSubmit = async (stacking?: boolean) => {
    try {
      const res = await postToSidecar(apiServer)(
        `/faucets/stx?address=${principal as string}${stacking ? '&stacking=true' : ''}`
      );
      const resp = await res.json();
      setResponse(resp);
    } catch (e) {
      setResponse({ error: e.message });
    }
  };

  const handleStackingRequest = () => {
    if (stackingIndex <= 3) {
      setIndex(i => ++i);
      if (stackingIndex === 3) {
        void handleSubmit(true);
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
    <Grid flexGrow={1} maxHeight="600px" placeItems="center" flexDirection="column" p="extra-loose">
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
        {response?.error ? (
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
            {response?.error === 'Too many requests'
              ? "Sorry, you've hit your limit for today. Try again tomorrow."
              : response?.error?.includes('ConflictingNonceInMempool')
              ? 'There is a pending faucet transaction, try again soon!'
              : response?.error}
          </Box>
        ) : null}

        {response?.success ? (
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
          <Button mx="auto" onClick={() => handleSubmit()}>
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
  );
};
