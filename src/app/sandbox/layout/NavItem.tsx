import { useColorModeValue } from '@/components/ui/color-mode';
import { NextLink } from '@/ui/NextLink';
import { FC, ReactNode } from 'react';

import { Tooltip } from '../../../ui/Tooltip';

export const NavItem: FC<{ label: string; icon: ReactNode; isSelected?: boolean; url: string }> = ({
  label,
  icon,
  isSelected,
  url,
}) => {
  const selectedBg = useColorModeValue(`slate.150`, `slate.800`);
  const hoverBg = useColorModeValue(`slate.100`, `slate.900`);
  const borderColor = useColorModeValue('slate.150', 'slate.900');
  return (
    <Tooltip positioning={{ placement: 'left' }} content={label} key={url}>
      <NextLink
        href={url}
        display={'flex'}
        bg={isSelected ? selectedBg : undefined}
        borderBottom="1px"
        borderColor={borderColor}
        width={16}
        height={16}
        alignItems="center"
        justifyContent="center"
        _hover={{
          bg: hoverBg,
        }}
      >
        {icon}
      </NextLink>
    </Tooltip>
  );
};
