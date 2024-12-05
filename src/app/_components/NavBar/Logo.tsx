import { ExplorerLink } from '../../../common/components/ExplorerLinks';
import { Icon, IconProps } from '../../../ui/Icon';
import StxIcon from '../../../ui/icons/StxIcon';

export function Logo({ ...iconProps }: IconProps) {
  return (
    <ExplorerLink href={'/'} title="Stacks Explorer">
      <Icon size={6} color="white" flexShrink={0} aria-label="Homepage" {...iconProps}>
        <StxIcon />
      </Icon>
    </ExplorerLink>
  );
}
