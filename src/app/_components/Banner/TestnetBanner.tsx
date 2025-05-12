import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { Warning } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { Banner } from './Banner';

export const TestnetBanner = () => {
  const isTestnet = useGlobalContext().activeNetwork.mode === 'testnet';
  if (!isTestnet) {
    return null;
  }
  return (
    <Banner
      content={
        <Flex gap={1.5} alignItems="center">
          <Icon color="var(--stacks-colors-yellow-400)">
            <Warning />
          </Icon>
          <Text textStyle="text-semibold-sm" color="textInvert" fontStyle="instrument">
            You are viewing Testnet.
          </Text>
        </Flex>
      }
      bg="var(--stacks-colors-black)"
    />
  );
};
