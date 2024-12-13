import { Menu } from '@chakra-ui/react';

import { Icon } from '../../../ui/Icon';
import { NextLink } from '../../../ui/NextLink';
import { Text } from '../../../ui/Text';
import { getLinkIcon, getUrlName, isExplorerLink } from './utils';

export const LinksGroup = ({ title, links }: { title: string; links: string[] }) => {
  if (!links.length) return null;
  return (
    <Menu.ItemGroup title={title}>
      {links.map(link => {
        return (
          <Menu.Item
            // TODO: upgrade v3. This may be broken
            key={link}
            asChild
            gap={'5px'}
            value={link}
          >
            <NextLink href={link} target={!isExplorerLink(link) ? '_blank' : undefined}>
              <Icon color="currentColor" size="12px">
                {getLinkIcon(link)}
              </Icon>
              <Text fontSize={'14px'} lineHeight={'1em'}>
                {getUrlName(link)}
              </Text>
            </NextLink>
          </Menu.Item>
        );
      })}
    </Menu.ItemGroup>
  );
};
