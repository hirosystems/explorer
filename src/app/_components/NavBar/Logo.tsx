import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { Icon, IconProps } from '../../../ui/Icon';
import StxIcon from '../../../ui/icons/StxIcon';

export function Logo({ ...iconProps }: IconProps) {
  return (
    <ExplorerLink href={'/'}>
      <Icon
        as={StxIcon}
        size={6}
        fill="bg"
        flexShrink={0}
        aria-label="Homepage"
        title="Stacks Explorer"
        {...iconProps}
      />
    </ExplorerLink>
  );
}
