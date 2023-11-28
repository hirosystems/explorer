'use client';

import { NextPage } from 'next';
import React from 'react';

import { Badge } from '../../../common/components/Badge';
import { DropIcon } from '../../../common/components/icons/drop';
import { useFaucet } from '../../../common/queries/useFaucet';
import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { Grid } from '../../../ui/Grid';
import { Stack } from '../../../ui/Stack';
import { StxIcon } from '../../../ui/icons';
import { Text, Title } from '../../../ui/typography';
import { Wrapper } from '../Wrapper';
import { useUser } from '../hooks/useUser';

function getErrorMessage(error: any) {
  if (!error) return '';
  const defaultErrorMessage = 'Something went wrong, please try again later.';
  if (!!error?.message) {
    return error.message;
  }
  if (!!error?.status) {
    switch (error.status) {
      case 429:
        return 'Too many requests, please try again later.';
      default:
        return defaultErrorMessage;
    }
  } else {
    return defaultErrorMessage;
  }
}

const Faucet: NextPage = () => {
  const { stxAddress } = useUser();
  const [stackingIndex, setIndex] = React.useState(0);
  const { mutate: runFaucetStx, error, isSuccess } = useFaucet();
  const errorMessage = getErrorMessage(error);
  const handleStackingRequest = () => {
    if (stackingIndex <= 3) {
      setIndex(i => ++i);
      if (stackingIndex === 3 && !!stxAddress) {
        void runFaucetStx({ address: stxAddress, staking: true });
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
    <Wrapper>
      <Grid minHeight="600px" placeItems="center" flexDirection="column">
        <Box mb="20px">
          <Grid
            placeItems="center"
            mb="32px"
            mx="auto"
            size="120px"
            borderWidth="1px"
            borderRadius="100%"
            position="relative"
            justifyContent="center"
          >
            <Grid
              placeItems="center"
              position="absolute"
              bottom="-5px"
              left="-5px"
              size="42px"
              borderRadius="100%"
              bg={'bg'}
            >
              <Grid placeItems="center" size="42px" borderRadius="100%">
                <DropIcon fill={'accent'} color="blue" size="20px" />
              </Grid>
            </Grid>
            <StxIcon color={'invert'} size="48px" />
          </Grid>
          <Title mb="16px" width="100%" mx="auto" fontSize="24px" textAlign="center">
            STX Faucet
          </Title>
          <Text
            mx="auto"
            width="100%"
            textAlign="center"
            color={'textBody'}
            maxWidth="24ch"
            lineHeight="1.8"
            display="block"
            mb={0}
          >
            Need STX to test the network? The faucet can top you up!
          </Text>
          {!!errorMessage ? (
            <Box
              mt="16px"
              borderRadius="6px"
              bg="rgba(207,0,0,0.05)"
              border="1px solid rgba(207,0,0,0.1)"
              p="16px"
              color="red"
              textAlign="center"
              lineHeight="1.8"
              wordBreak="break-all"
            >
              {errorMessage}
            </Box>
          ) : null}

          {isSuccess ? (
            <Box
              mt="16px"
              borderRadius="6px"
              bg={'bgAlt'}
              borderWidth="1px"
              p="16px"
              color={'textBody'}
              textAlign="center"
            >
              <Stack justifyContent="center" isInline spacing="16px">
                <Box>💰</Box>
                <Box>STX coming your way shortly!</Box>
                <Box>💰</Box>
              </Stack>
            </Box>
          ) : null}

          <Stack spacing="16px" justifyContent="center" mt="16px">
            <Button mx="auto" onClick={() => !!stxAddress && runFaucetStx({ address: stxAddress })}>
              Request STX
            </Button>
            <Badge
              color={'textBody'}
              mx="auto"
              onClick={() => handleStackingRequest()}
              userSelect="none"
              _hover={
                stackingIndex !== 4
                  ? {
                      bg: 'bgAlt',
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
    </Wrapper>
  );
};

export default Faucet;
