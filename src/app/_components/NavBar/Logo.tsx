import { FC } from 'react';

import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { Icon } from '../../../ui/Icon';
import { StxIcon } from '../../../ui/icons';

export const Logo: FC = () => {
  return (
    <ExplorerLink href={'/'}>
      <Icon
        as={StxIcon}
        size="22px"
        color="white"
        flexShrink={0}
        aria-label="Homepage"
        title="Stacks Explorer"
      />
    </ExplorerLink>
  );
};
