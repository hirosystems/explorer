import { Badge } from '@/common/components/Badge';
import { useGlobalContext } from '@/common/context/useAppContext';
import { capitalize } from '@/common/utils';
import { Flex } from '@/ui/components';
import { Text } from '@/ui/typography';
import { FC } from 'react';
import { TestnetAvailibityIcon } from './testnet-availability/avail-icon';

export const NetworkModeBanner: FC = () => {
  const networkMode = useGlobalContext().activeNetwork.mode;
  if (networkMode !== 'testnet') return null;
  return (
    <Badge bg="white" border={'none'}>
      <Flex alignItems="center" as={'span'}>
        <TestnetAvailibityIcon />
        <Text color={`textTitle.light`} whiteSpace={'nowrap'} as={'span'}>
          {capitalize(networkMode)} mode
        </Text>
      </Flex>
    </Badge>
  );
};
