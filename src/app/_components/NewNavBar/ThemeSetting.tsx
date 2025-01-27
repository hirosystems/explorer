'use client';

import { capitalize } from '@/common/utils/utils';
import { useColorMode } from '@/components/ui/color-mode';
import { Text } from '@/ui/Text';
import { Box, Flex, IconButton } from '@chakra-ui/react';

import { UniversalColorModeButton } from './UniversalColorModeButton';
import { SunDim } from '@phosphor-icons/react';

export const ThemeSetting = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex justifyContent="space-between">
      <Box>
        <Text color="textPrimary" fontSize="xs">
          Theme
        </Text>
        <Text color="textSecondary" fontSize="xs">
          {capitalize(colorMode)}
        </Text>
      </Box>
      <Flex border="1px solid" borderColor="newBorderSecondary" borderRadius="lg" p={1} gap={1} alignItems='center'>
        <UniversalColorModeButton
          colorMode="light"
          aria-label={'Change color mode'}
          color="iconInvert"
          borderWidth={'1px'}
          borderRadius="md"
          iconSize={4}
          h={6}
          w={8}
          py={1}
          px={2}
          bg='surfaceInvert'
        />
        <UniversalColorModeButton
          colorMode="dark"
          aria-label={'Change color mode'}
          color="iconSecondary"
          borderWidth={'1px'}
          borderRadius="md"
          iconSize={4}
          h={6}
          w={8}
          py={1}
          px={2}
        />
      </Flex>
    </Flex>
  );
};
