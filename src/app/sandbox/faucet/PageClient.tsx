'use client';

import { NextPage } from 'next';
import React from 'react';

import { Badge } from '../../../common/components/Badge';
import { DropIcon } from '../../../common/components/icons/drop';
import { useFaucet } from '../../../common/queries/useFaucet';
import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { HStack } from '../../../ui/HStack';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import StxIcon from '../../../ui/icons/StxIcon';
import { Text, Title } from '../../../ui/typography';
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
    <Stack alignItems={'center'} mt={46} gap={6}>
      <Icon as={StxIcon} size={10} />
      <Title>STX Faucet</Title>
      <Text fontSize={'sm'}>Need STX to test the network? The faucet can top you up!</Text>
      {!!errorMessage ? <Text color={'error'}>{errorMessage}</Text> : null}
      {isSuccess ? (
        <HStack gap={4} fontSize={'sm'}>
          <Text>💰</Text>
          <Text>STX coming your way shortly!</Text>
          <Text>💰</Text>
        </HStack>
      ) : null}
      <Stack gap={4}>
        <Button
          variant={'primary'}
          mx="auto"
          onClick={() => !!stxAddress && runFaucetStx({ address: stxAddress })}
        >
          Request STX
        </Button>
        <Button
          size={'xs'}
          fontSize={'xs'}
          variant={'secondary'}
          onClick={() => handleStackingRequest()}
        >
          {getStackingLabel()}
        </Button>
      </Stack>
    </Stack>
  );
};

export default Faucet;
