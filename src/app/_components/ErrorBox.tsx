import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { VscError } from 'react-icons/vsc';

import { useGlobalContext } from '../../common/context/useAppContext';
import { buildUrl } from '../../common/utils/buildUrl';
import { Button } from '../../ui/Button';
import { ButtonLink } from '../../ui/ButtonLink';
import { Flex, FlexProps } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';

export function ErrorBox({
  error,
  reset,
  homeButton,
  tryAgainButton,
  ...flexProps
}: {
  error: Error;
  reset: () => void;
  homeButton?: boolean;
  tryAgainButton?: boolean;
} & FlexProps) {
  const network = useGlobalContext().activeNetwork;
  const errorName = error.name || 'Unknown error';
  const errorMessage = error.message || 'Something went wrong, please try again later.';
  return (
    <Flex
      direction={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      height={'100%'}
      gap={'10px'}
      padding="10px"
      {...flexProps}
    >
      <Icon as={VscError} size="24px" />
      <Flex direction={'column'} alignItems={'center'} gap={'4px'}>
        <Text color={`error`} fontSize={14}>
          {errorName}
        </Text>
        <Text fontSize={12} textAlign={'center'}>
          {errorMessage}
        </Text>
      </Flex>
      <Flex gap="16px">
        {homeButton && (
          <ButtonLink href={buildUrl('/', network)} size={'xs'} fontSize={'12px'}>
            Go home
          </ButtonLink>
        )}
        {tryAgainButton && (
          <Button onClick={() => reset()} variant="secondary" size={'xs'} fontSize={'12px'}>
            Try again
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
