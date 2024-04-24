import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode, useCallback, useRef } from 'react';
import { TfiReload } from 'react-icons/tfi';

import { Button } from '../../../ui/Button';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';
import { useBlockListContext } from './BlockListContext';
import { FADE_DURATION } from './consts';

interface UpdateBarProps extends FlexProps {
  latestBlocksCount: number;
  onClick: () => void;
}

export function UpdateBarLayout({
  isBlockListLoading,
  children,
  ...rest
}: {
  isBlockListLoading: boolean;
  children: ReactNode;
}) {
  const bgColor = useColorModeValue('purple.100', 'slate.900'); // TODO: not in theme. remove

  return (
    <Flex
      justifyContent="space-between"
      backgroundColor={bgColor}
      marginX={-6}
      px={6}
      py={2.5}
      gap={1}
      style={{
        transition: `opacity ${FADE_DURATION / 1000}s`,
        opacity: isBlockListLoading ? 0 : 1,
      }}
      {...rest}
    >
      {children}
    </Flex>
  );
}

export function UpdateBar({ latestBlocksCount, onClick, ...rest }: UpdateBarProps) {
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
    <UpdateBarLayout {...rest} isBlockListLoading={isBlockListLoading}>
      <Text
        fontSize={'sm'}
        color={textColor}
        textOverflow={'ellipsis'}
        overflow={'hidden'}
        whiteSpace={'nowrap'}
      >
        <Text display={'inline'} fontWeight={700}>
          {latestBlocksCount}
        </Text>{' '}
        new Stacks blocks have come in
      </Text>
      <Button variant="text" onClick={update} disabled={latestBlocksCount === 0}>
        <Flex alignItems={'center'} gap={1.5}>
          <Icon
            color="buttonText"
            as={TfiReload}
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
