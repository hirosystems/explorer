import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { XCircle } from '@phosphor-icons/react';

import { useGlobalContext } from '../../common/context/useGlobalContext';
import { buildUrl } from '../../common/utils/buildUrl';
import { Button } from '../../ui/Button';
import { ButtonLink } from '../../ui/ButtonLink';
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
      <Icon h={6} w={6}>
        <XCircle />
      </Icon>
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
          <ButtonLink href={buildUrl('/', network)} fontSize={'xs'}>
            Go home
          </ButtonLink>
        )}
        {tryAgainButton && (
          <Button onClick={() => reset()} variant="secondary" fontSize={'xs'}>
            Try again
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
