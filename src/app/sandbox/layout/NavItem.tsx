import { Link } from '@chakra-ui/next-js';
import { useColorModeValue } from '@chakra-ui/react';
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
    <Tooltip placement="left" label={label} key={url}>
      <Link
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
      </Link>
    </Tooltip>
  );
};
