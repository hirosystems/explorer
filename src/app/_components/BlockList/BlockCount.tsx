import { Icon } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import pluralize from 'pluralize';
import { memo } from 'react';

import { Button } from '../../../ui/Button';
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
  const canLoadMore = !minimized && !isFirst;

  return (
    <Button
      onClick={canLoadMore ? loadMoreStxBlocksHandler : () => {}}
      cursor={canLoadMore ? 'pointer' : 'default'}
      py={3}
      px={2}
      width="fit-content"
      height={8}
      bg={'blockList.blockCount.background'}
      rounded="full"
      _hover={
        canLoadMore
          ? {
              bg: 'blockList.blockCount.backgroundHover',
            }
          : {
              bg: 'blockList.blockCount.background',
            }
      }
    >
      <Text
        display="flex"
        color={canLoadMore ? 'blockList.blockCount.text' : 'text'}
        fontSize="xs"
        fontWeight="semibold"
        alignItems="center"
        gap={1}
        _groupHover={
          canLoadMore
            ? {
                textDecorationColor: 'blockList.blockCount.text',
              }
            : {}
        }
      >
        +{count} {pluralize('block', count)}
        {canLoadMore ? (
          <Icon h={2.5} w={2.5} color={'blockList.blockCount.icon'}>
            <CaretDown />
          </Icon>
        ) : null}
      </Text>
    </Button>
  );
});
