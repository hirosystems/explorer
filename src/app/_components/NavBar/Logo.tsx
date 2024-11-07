import { Icon, IconProps } from '@chakra-ui/react';

import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import StxIcon from '../../../ui/icons/StxIcon';

export function Logo({ ...iconProps }: IconProps) {
  return (
    <ExplorerLink href={'/'} title="Stacks Explorer">
      <Icon h={6} w={6} color="white" flexShrink={0} aria-label="Homepage" {...iconProps}>
        <StxIcon />
      </Icon>
    </ExplorerLink>
  );
}
