import { useColorModeValue } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { memo, useMemo } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

import { Circle } from '../../../common/components/Circle';
import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';

export const BlockCount = memo(function ({
  count,
  btcBlockHash,
  isFirst,
}: {
  count: number;
  btcBlockHash?: string;
  isFirst?: boolean;
}) {
  // TODO: remove. use theme
  const bgColor = useColorModeValue('purple.100', 'slate.900');
  const bgColorHover = useColorModeValue('purple.200', 'slate.850');
  const textColor = useColorModeValue('purple.600', 'purple.400');
  const iconColor = useColorModeValue('purple.600', 'purple.200');
  const content = useMemo(() => {
    return (
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
        _hover={
          isFirst
            ? {}
            : {
                textDecoration: 'underline',
                bg: bgColorHover,
                textDecorationColor: textColor,
              }
        }
      >
        +{count} {pluralize('block', count)}
        <Circle size={4.5} bg="surface">
          <Icon as={ArrowUpRight} size={2.5} color={iconColor} />
        </Circle>
      </Text>
    );
  }, [count, bgColor, bgColorHover, textColor, iconColor, isFirst]);

  return (
    <Flex py={3}>
      {isFirst ? (
        <>{content}</>
      ) : (
        <ExplorerLink href={btcBlockHash ? `btcblock/${btcBlockHash}` : '/blocks'}>
          {content}
        </ExplorerLink>
      )}
    </Flex>
  );
});
