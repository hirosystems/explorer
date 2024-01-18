import { useColorModeValue } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { memo } from 'react';
import { PiArrowUpRight } from 'react-icons/pi';

import { Circle } from '../../../../common/components/Circle';
import { ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';

export const BlockCount = memo(function ({ count }: { count: number }) {
  const bgColor = useColorModeValue('purple.100', 'slate.900');
  const bgColorHover = useColorModeValue('purple.200', 'slate.850');
  const textColor = useColorModeValue('purple.600', 'purple.400');
  const iconColor = useColorModeValue('purple.600', 'purple.200');
  const circleColor = useColorModeValue('white', 'black');
  return (
    <Flex ml={-3} pb={4} pt={1}>
      <ExplorerLink href={'/blocks'}>
        <Text
          display={'flex'}
          color={textColor}
          fontSize={'xs'}
          bg={bgColor}
          rounded={'full'}
          px={2}
          alignItems={'center'}
          gap={1}
          width={'fit-content'}
          height={8}
          _hover={{
            textDecoration: 'underline',
            bg: bgColorHover,
            textDecorationColor: textColor,
          }}
        >
          +{count} {pluralize('block', count)}
          <Circle size={4.5} bg={circleColor}>
            <Icon as={PiArrowUpRight} size={2.5} color={iconColor} />
          </Circle>
        </Text>
      </ExplorerLink>
    </Flex>
  );
});
