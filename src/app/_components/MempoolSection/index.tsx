'use client';

import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { HStack, Stack } from '@chakra-ui/react';

import { TxCountChart } from './TxCountChart';

function SectionHeader() {
  const network = useGlobalContext().activeNetwork;
  return (
    <HStack align="center" justify={'space-between'}>
      <Text textStyle="heading-md" color="textPrimary">
        Mempool
      </Text>
      <ButtonLink
        href={buildUrl('/mempool', network)}
        buttonLinkSize="big"
        display={['none', 'inline']}
      >
        View mempool
      </ButtonLink>
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
  const network = useGlobalContext().activeNetwork;
  return (
    <Stack gap={6} flex={1} height="100%">
      <SectionHeader />
      <TxCountSection />
      <ButtonLink
        href={buildUrl('/mempool', network)}
        buttonLinkSize="big"
        display={{ base: 'inline', sm: 'none' }}
      >
        View mempool
      </ButtonLink>
    </Stack>
  );
}
