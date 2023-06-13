import { Badge } from '@/common/components/Badge';
import { useGlobalContext } from '@/common/context/useAppContext';
import { capitalize } from '@/common/utils';
import { Flex } from '@/ui/components';
import { Text } from '@/ui/typography';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import { TestnetPendingIcon } from './testnet-status-icon';

const TestnetStatusIcon = dynamic(() => import('./testnet-status-icon'), {
  loading: () => <TestnetPendingIcon />,
  ssr: false,
});

export const NetworkModeBanner: FC = () => {
  const networkMode = useGlobalContext().activeNetwork.mode;
  if (networkMode !== 'testnet') return null;
  return (
    <Badge bg="white" border={'none'}>
      <Flex alignItems="center" as={'span'}>
        <TestnetStatusIcon />
        <Text color={`textTitle.light`} whiteSpace={'nowrap'} as={'span'}>
          {capitalize(networkMode)} mode
        </Text>
      </Flex>
    </Badge>
  );
};
