import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../common/context/useAppContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Link } from '../../../ui/Link';

export enum NavDirection {
  Forward = 'forward',
  Backward = 'backward',
}

export function NavBlock({ href, direction }: { href: string; direction: NavDirection }) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Link
      href={buildUrl(href!, network)}
      height={8}
      width={8}
      border="2px solid var(--stacks-colors-slate-50)"
      borderRadius="md"
    >
      <Flex alignItems="center" justifyContent="center" height="100%" width="100%">
        <Icon
          as={direction === NavDirection.Forward ? ArrowRight : ArrowLeft}
          size={4}
          fill="var(--stacks-colors-slate-50)"
        />
      </Flex>
    </Link>
  );
}
