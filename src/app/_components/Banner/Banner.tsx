'use client';

import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { BREAKPOINTS } from '@/ui/theme/breakpoints';
import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { ReactNode, forwardRef, useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export const Banner = forwardRef<
  HTMLDivElement,
  {
    content: ReactNode;
    bannerKey?: string;
    isDismissible?: boolean;
    isDismissedCookie?: boolean;
  } & Omit<FlexProps, 'content'>
>(({ content, bannerKey, isDismissible, isDismissedCookie, ...flexProps }, ref) => {
  const [_, setCookie] = useCookies([bannerKey || '']);
  const [isDismissed, setIsDismissed] = useState(isDismissedCookie || false);

  const handleDismiss = useCallback(() => {
    if (bannerKey) {
      setCookie(bannerKey, 'true');
      setIsDismissed(true);
    }
  }, [bannerKey, setCookie]);

  if (isDismissed) {
    return null;
  }

  return (
    <Flex
      w="full"
      minHeight={10}
      alignItems="center"
      justifyContent="center"
      ref={ref}
      py={1}
      bg={{
        base: 'var(--stacks-colors-accent-stacks-400)',
        _dark: 'var(--stacks-colors-accent-stacks-600)',
      }}
      {...flexProps}
    >
      <Flex
        gap={3}
        maxWidth={BREAKPOINTS['2xl']}
        alignItems={['flex-start', 'flex-start', 'flex-start', 'center']}
        justifyContent="center"
        flexDirection={{ base: 'column', lg: 'row' }}
        px={[5, 5, 5, undefined]}
        py={[2, 2, 2, undefined]}
      >
        {content}

        {isDismissible && (
          <Button variant={'redesignPrimary'} size={'small'} onClick={handleDismiss}>
            <Flex gap={1.5} alignItems="center">
              <Icon h={3} w={3}>
                <X />
              </Icon>
              <Text>Dismiss</Text>
            </Flex>
          </Button>
        )}
      </Flex>
    </Flex>
  );
});
