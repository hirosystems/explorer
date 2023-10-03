import { useColorMode } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Badge } from '@/common/components/Badge';
import { useGlobalContext } from '@/common/context/useAppContext';
import { capitalize } from '@/common/utils';
import { Flex, Icon } from '@/ui/components';
import { FlaskIcon } from '@/ui/icons';
import { Text } from '@/ui/typography';

export function NetworkModeBanner(props: { children?: ReactNode }) {
  const networkMode = useGlobalContext().activeNetwork.mode;
  const { colorMode } = useColorMode();
  if (networkMode !== 'testnet') return null;
  return (
    <Badge bg="white" border="none">
      <Flex alignItems="center" as="span">
        <Icon as={FlaskIcon} color={`brand.${colorMode}`} size="16px" mr="4px" />
        <Text color="textTitle.light" whiteSpace="nowrap" as="span">
          {capitalize(networkMode)} mode
        </Text>
      </Flex>
    </Badge>
  );
}
