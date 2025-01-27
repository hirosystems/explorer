import { useColorMode } from '@/components/ui/color-mode';
import { StacksSmileyDarkIcon } from '@/ui/icons/StacksSmileyDarkIcon';
import { StacksSmileyLaserEyesDarkIcon } from '@/ui/icons/StacksSmileyLaserEyesDarkIcon';
import { StacksSmileyLaserEyesLightIcon } from '@/ui/icons/StacksSmileyLaserEyesLightIcon';
import { StacksSmileyLightIcon } from '@/ui/icons/StacksSmileyLightIcon';
import { Box, BoxProps, ClientOnly } from '@chakra-ui/react';
import { useState } from 'react';

export const StacksSmiley = (boxProps: BoxProps) => {
  const { colorMode } = useColorMode();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <ClientOnly>
      <Box
        className="stacks-smiley"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...boxProps}
      >
        {colorMode === 'light' ? (
          isHovered ? (
            <StacksSmileyLaserEyesLightIcon h={14} w={14} />
          ) : (
            <StacksSmileyLightIcon h={14} w={14} />
          )
        ) : isHovered ? (
          <StacksSmileyLaserEyesDarkIcon h={14} w={14} />
        ) : (
          <StacksSmileyDarkIcon h={14} w={14} />
        )}
      </Box>
    </ClientOnly>
  );
};
