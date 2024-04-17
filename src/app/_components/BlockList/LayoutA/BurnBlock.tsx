import { useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { memo } from 'react';
import { BsArrowReturnLeft } from 'react-icons/bs';

import { Timestamp } from '../../../../common/components/Timestamp';
import { useGlobalContext } from '../../../../common/context/useAppContext';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import { TextLink } from '../../../../ui/TextLink';
import { BitcoinIcon } from '../../../../ui/icons';

interface ListItemProps extends FlexProps {
  height: number | string;
  hash: string;
  timestamp?: number;
}
export const BurnBlock = memo(function ({ timestamp, height, hash, ...flexProps }: ListItemProps) {
  const { btcBlockBaseUrl } = useGlobalContext().activeNetwork;
  const bgColor = useColorModeValue('slate.150', 'slate.900');
  const textColor = useColorModeValue('slate.700', 'slate.500');
  const iconColor = useColorModeValue('slate.600', 'slate.800');
  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={'center'}
      borderBottom={'1px'}
      pl={4}
      pr={8}
      height={14}
      backgroundColor={bgColor}
      mr={'-8'}
      ml={'-10'}
      color={textColor}
      {...flexProps}
    >
      <HStack gap={1.5}>
        <Icon
          as={BsArrowReturnLeft}
          transform={'rotate(90deg)'}
          size={2.5}
          color={iconColor}
          position={'relative'}
          bottom={'1px'}
        />
        <Icon as={BitcoinIcon} size={18} position={'relative'} bottom={'1px'} />
        <TextLink as="a" target="_blank" href={`${btcBlockBaseUrl}/${hash.replace('0x', '')}`}>
          <Text
            fontSize={'sm'}
            color={'secondaryText'}
            _hover={{
              textDecoration: 'underline',
              textDecorationColor: 'secondaryText',
            }}
          >
            #{height}
          </Text>
        </TextLink>
      </HStack>
      <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'xs'}>
        <Box>{truncateMiddle(hash, 3)}</Box>
        {timestamp && <Timestamp ts={timestamp} />}
      </HStack>
    </Flex>
  );
});
