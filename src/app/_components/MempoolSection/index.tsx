import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { Link } from '@/ui/Link';
import { Text } from '@/ui/Text';
import { HStack, Icon, Stack } from '@chakra-ui/react';
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
        View mempool
        <Icon w={3.5} h={3.5}>
          <ArrowRight />
        </Icon>
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
    >
      <TxCountChart />
    </HStack>
  );
}

export function MempoolSection() {
  return (
    <Stack gap={2} w={['100%', '100%', '50%']}>
      <Stack gap={5}>
        <SectionHeader />
        <TxCountSection />
      </Stack>
      {/* TODO: Fee section */}
    </Stack>
  );
}
