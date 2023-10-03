import { useColorMode } from '@chakra-ui/react';
import { TbSun, TbSunOff } from 'react-icons/tb';
import { IconButton, IconButtonProps } from '@/ui/components';

export function ColorModeButton(props: IconButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const Icon = colorMode === 'light' ? TbSun : TbSunOff;
  return (
    <IconButton
      icon={<Icon />}
      onClick={toggleColorMode}
      color="white"
      title="Toggle color mode"
      {...props}
    />
  );
}
