import { useColorModeValue } from '@chakra-ui/react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import { ReactNode, Suspense, useCallback, useRef } from 'react';

import { Button } from '../../../ui/Button';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';
import { useBlockListContext } from './BlockListContext';
import { UpdateBarSkeleton } from './Grouped/skeleton';
import { getFadeAnimationStyle } from './consts';
import { BlockListData, getApproximateStxBlocksPerMinuteFromBlockList } from './utils';

export function UpdateBarLayout({ children, ...rest }: { children: ReactNode }) {
  const bgColor = useColorModeValue('purple.100', 'slate.900'); // TODO: not in theme. remove

  return (
    <Flex
      justifyContent="space-between"
      backgroundColor={bgColor}
      mx={-6}
      px={6}
      py={2.5}
      gap={1}
      {...rest}
    >
      {children}
    </Flex>
  );
}

interface UpdateBarProps {
  blockList?: BlockListData[];
  onClick: () => void;
  latestBlocksCount?: number;
}

export function UpdateBarBase({
  blockList,
  onClick,
  latestBlocksCount,
  ...rest
}: {
  blockList?: BlockListData[];
  onClick: () => void;
  latestBlocksCount?: number;
} & FlexProps) {
  const textColor = useColorModeValue('slate.800', 'slate.400'); // TODO: not in theme. remove
  const lastClickTimeRef = useRef(0);
  const { isBlockListLoading } = useBlockListContext();

  const update = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 2000) {
      lastClickTimeRef.current = now;
      onClick();
    }
  }, [onClick]);

  return (
    <UpdateBarLayout {...rest}>
      <Text
        fontSize={'sm'}
        color={textColor}
        textOverflow={'ellipsis'}
        overflow={'hidden'}
        whiteSpace={'nowrap'}
        fontWeight={700}
        display={'inline'}
        style={getFadeAnimationStyle(isBlockListLoading)}
      >
        {latestBlocksCount
          ? latestBlocksCount
          : blockList
            ? `~${getApproximateStxBlocksPerMinuteFromBlockList(
                blockList
              )} Stacks blocks mined per min.`
            : ''}
      </Text>
      <Button variant="text" onClick={update}>
        <Flex alignItems={'center'} gap={1.5}>
          <Icon
            color="buttonText"
            as={ArrowCounterClockwise}
            w={'12px'}
            h={'12px'}
            transform={'rotate(90deg) scaleX(-1)'}
          />
          Update
        </Flex>
      </Button>
    </UpdateBarLayout>
  );
}

export function UpdateBar({
  // not needed
  blockList,
  onClick,
  latestBlocksCount,
  ...rest
}: UpdateBarProps & FlexProps) {
  return (
    <Suspense fallback={<UpdateBarSkeleton />}>
      <UpdateBarBase
        latestBlocksCount={latestBlocksCount}
        blockList={blockList}
        onClick={onClick}
        {...rest}
      />
    </Suspense>
  );
}
