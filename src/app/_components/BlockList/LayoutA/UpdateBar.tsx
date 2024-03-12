import { useColorModeValue } from '@chakra-ui/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { TfiReload } from 'react-icons/tfi';

import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import { FADE_DURATION } from './consts';

export function UpdateBar({
  latestBlocksCount,
  onClick,
  isUpdateListLoading,
}: {
  latestBlocksCount: number;
  onClick: () => void;
  isUpdateListLoading: boolean;
}) {
  const bgColor = useColorModeValue('purple.100', 'slate.900');
  const buttonColor = useColorModeValue('brand', 'purple.400');
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
      <Text _hover={{ cursor: 'pointer' }} onClick={update}>
        <Flex alignItems={'center'} gap={'6px'}>
          <Icon
            color={buttonColor}
            as={TfiReload}
            w={'12px'}
            h={'12px'}
            transform={'rotate(90deg) scaleX(-1)'}
          />
          <Text fontSize={'14px'} color={buttonColor}>
            Update
          </Text>
        </Flex>
      </Text>
    </Flex>
  );
}
