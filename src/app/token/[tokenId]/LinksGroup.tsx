import { MenuGroup } from '@/ui/MenuGroup';
import { MenuItem } from '@/ui/MenuItem';
import { TextLink } from '@/ui/TextLink';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { getLinkIcon, getUrlName, isExplorerLink } from '@/app/token/[tokenId]/utils';

export const LinksGroup = ({ title, links }: { title: string; links: string[] }) => {
  if (!links.length) return null;
  return (
    <MenuGroup title={title}>
      {links.map(link => {
        return (
          <MenuItem
            key={link}
            as={TextLink}
            href={link}
            gap={'5px'}
            target={!isExplorerLink(link) ? '_blank' : undefined}
          >
            <Icon as={getLinkIcon(link)} color="currentColor" size="12px" />
            <Text fontSize={'14px'} lineHeight={'1em'}>
              {getUrlName(link)}
            </Text>
          </MenuItem>
        );
      })}
    </MenuGroup>
  );
};
