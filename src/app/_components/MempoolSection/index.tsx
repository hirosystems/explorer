'use client';

import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { Link } from '@/ui/Link';
import { Text } from '@/ui/Text';
import { Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

import { TxCountChart } from './TxCountChart';

function SectionHeader() {
  const network = useGlobalContext().activeNetwork;
  return (
    <HStack align="center" justify={'space-between'}>
      <Text textStyle="heading-md" color="textPrimary">
        Mempool
      </Text>
      <Link
        href={buildUrl('/mempool', network)}
        variant={'buttonLink'}
        size={'lg'}
        display={['none', 'inline']}
      >
        <Flex gap={1.5} alignItems="center">
          View mempool
          <Icon w={3.5} h={3.5}>
            <ArrowRight />
          </Icon>
        </Flex>
      </Link>
    </HStack>
  );
}

function TxCountSection() {
  return (
    <HStack
      align="space-between"
      bg="surfaceSecondary"
      borderRadius={'xl'}
      p="6"
      pl={['6', '6', '8']}
      flex="1"
      height="100%"
      alignSelf="stretch"
    >
      <TxCountChart />
    </HStack>
  );
}

export function MempoolSection() {
  return (
    <Stack gap={4} flex={1} height="100%">
      <SectionHeader />
      <TxCountSection />
    </Stack>
  );
}
