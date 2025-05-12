'use client';

import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { BREAKPOINTS } from '@/ui/theme/breakpoints';
import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { ReactNode, forwardRef, useEffect, useState } from 'react';

export const Banner = forwardRef<
  HTMLDivElement,
  {
    content: ReactNode;
    isDismissible?: boolean;
    bannerKey?: string;
  } & Omit<FlexProps, 'content'>
>(({ content, bannerKey, isDismissible, ...flexProps }, ref) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (bannerKey) {
      setIsDismissed(localStorage.getItem(bannerKey) === 'true');
    }
  }, [bannerKey]);

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
      <Flex gap={3} maxWidth={BREAKPOINTS['2xl']} alignItems="center" justifyContent="center">
        {content}

        {isDismissible && bannerKey && (
          <Button
            variant={'redesignPrimary'}
            size={'small'}
            onClick={() => {
              setIsDismissed(true);
              localStorage.setItem(bannerKey, 'true');
            }}
          >
            <Flex gap={1.5} alignItems="center">
              <Icon h={3} w={3}>
                <X />
              </Icon>
              <Text>Close and don't show again</Text>
            </Flex>
          </Button>
        )}
      </Flex>
    </Flex>
  );
});
