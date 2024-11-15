import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { Icon, IconProps } from '../../../ui/Icon';
import StxIcon from '../../../ui/icons/StxIcon';

export function Logo({ ...iconProps }: IconProps) {
  return (
    <ExplorerLink href={'/'} title="Stacks Explorer">
      <Icon as={StxIcon} size={6} fill="bg" flexShrink={0} aria-label="Homepage" {...iconProps} />
    </ExplorerLink>
  );
}
