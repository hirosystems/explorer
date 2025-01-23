import { Flex, Icon, IconProps } from '@chakra-ui/react';

import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import StxIcon from '../../../ui/icons/StxIcon';

export function Logo({ ...iconProps }: IconProps) {
  return (
    <Flex bg="black" h={10} w={10} borderRadius="xl" alignItems="center" justifyContent="center">
      <ExplorerLink href={'/'} title="Stacks Explorer">
        <Icon h={6} w={6} color="white" aria-label="Homepage" {...iconProps}>
          <StxIcon />
        </Icon>
      </ExplorerLink>
    </Flex>
  );
}
