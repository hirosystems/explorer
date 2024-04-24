import { useColorModeValue } from '@chakra-ui/react';
import { useCallback, useRef } from 'react';
import { TfiReload } from 'react-icons/tfi';

import { Button } from '../../../../ui/Button';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import { FADE_DURATION } from './consts';

interface UpdateBarProps extends FlexProps {
  latestBlocksCount: number;
  onClick: () => void;
  isUpdateListLoading: boolean;
}

export function UpdateBar({
  latestBlocksCount,
  onClick,
  isUpdateListLoading,
  ...rest
}: UpdateBarProps) {
  const bgColor = useColorModeValue('purple.100', 'slate.900');
  const textColor = useColorModeValue('slate.800', 'slate.400');
  const lastClickTimeRef = useRef(0);

  const update = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 2000) {
      lastClickTimeRef.current = now;
      onClick();
    }
  }, [onClick]);

  return (
    <Flex
      justifyContent={'space-between'}
      backgroundColor={bgColor}
      marginX={-6}
      px={6}
      py={2.5}
      gap={1}
      style={{
        transition: `opacity ${FADE_DURATION / 1000}s`,
        opacity: isUpdateListLoading ? 0 : 1,
      }}
      {...rest}
    >
      <Text
        fontSize={'14px'}
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
    </Flex>
  );
}
