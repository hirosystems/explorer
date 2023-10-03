import { ReactNode } from 'react';
import { ExplorerLink } from '@/components/links';
import { IconButton } from '@/ui/IconButton';
import { StxIcon } from '@/ui/icons';

export function Logo(props: { children?: ReactNode }) {
  return (
    <ExplorerLink href="/">
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
}
