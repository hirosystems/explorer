import { useColorModeValue } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import pluralize from 'pluralize';
import { memo } from 'react';

import { Button } from '../../../ui/Button';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';

export const BlockCount = memo(function ({
  count,
  isFirst,
  loadMoreStxBlocksHandler,
  minimized = false,
}: {
  count: number;
  isFirst?: boolean;
  loadMoreStxBlocksHandler?: () => void;
  minimized?: boolean;
}) {
  const bgColor = useColorModeValue('purple.100', 'slate.900');
  const bgColorHover = useColorModeValue('purple.200', 'slate.850');
  const textColor = useColorModeValue('purple.600', 'purple.400');
  const iconColor = useColorModeValue('purple.600', 'purple.200');
  const canLoadMore = !minimized && !isFirst;

  return (
    <Button
      onClick={canLoadMore ? loadMoreStxBlocksHandler : () => {}}
      cursor={canLoadMore ? 'pointer' : 'default'}
      py={3}
      px={2}
      width="fit-content"
      height={8}
      bg={bgColor}
      rounded="full"
      _hover={
        canLoadMore
          ? {
              bg: bgColorHover,
            }
          : {
              bg: bgColor,
            }
      }
    >
      <Text
        display="flex"
        color={canLoadMore ? textColor : 'text'}
        fontSize="xs"
        alignItems="center"
        gap={1}
        _groupHover={
          canLoadMore
            ? {
                textDecorationColor: textColor,
              }
            : {}
        }
      >
        +{count} {pluralize('block', count)}
        {canLoadMore ? <Icon as={CaretDown} size={2.5} color={iconColor} /> : null}
      </Text>
    </Button>
  );
});
