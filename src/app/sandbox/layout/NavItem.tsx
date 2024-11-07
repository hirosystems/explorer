import { FC, ReactNode } from 'react';

import { NextLink } from '../../../ui/NextLink';
import { Tooltip } from '../../../ui/Tooltip';

export const NavItem: FC<{ label: string; icon: ReactNode; isSelected?: boolean; url: string }> = ({
  label,
  icon,
  isSelected,
  url,
}) => {
  return (
    <Tooltip positioning={{ placement: 'left' }} content={label} key={url}>
      <NextLink
        href={url}
        display={'flex'}
        bg={isSelected ? 'sandbox.navItem.selectedBackground' : undefined}
        borderBottom={`1px solid var(--stacks-colors-sandbox-nav-item-border)`}
        width={16}
        height={16}
        alignItems="center"
        justifyContent="center"
        _hover={{
          bg: 'sandbox.navItem.hoverBackground',
        }}
      >
        {icon}
      </NextLink>
    </Tooltip>
  );
};
