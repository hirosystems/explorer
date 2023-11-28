import { FC } from 'react';

import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { IconButton } from '../../../ui/IconButton';
import { StxIcon } from '../../../ui/icons';

export const Logo: FC = () => {
  return (
    <ExplorerLink href={'/'}>
      <a>
        <IconButton
          size="42px"
          icon={<StxIcon strokeWidth={1.5} size="24px" color="white" />}
          flexShrink={0}
          aria-label="Homepage"
          title="Stacks Explorer"
          as="span"
        />
      </a>
    </ExplorerLink>
  );
};
