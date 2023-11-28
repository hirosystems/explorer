import { useColorMode } from '@chakra-ui/react';
import React from 'react';
import { BsChevronDown } from 'react-icons/bs';

import { Button } from '../../../ui/Button';
import { Icon } from '../../../ui/Icon';
import { Menu } from '../../../ui/Menu';
import { MenuButton } from '../../../ui/MenuButton';
import { MenuDivider } from '../../../ui/MenuDivider';
import { MenuList } from '../../../ui/MenuList';
import { LinksGroup } from './LinksGroup';
import { TokenLinks } from './types';

export function LinksMenu(props: { links: TokenLinks }) {
  const colorMode = useColorMode().colorMode;
  return (
    <Menu>
      <MenuButton
        as={Button}
        backgroundColor={colorMode === 'light' ? 'white' : 'transparent'}
        variant={colorMode === 'light' ? undefined : 'outline'}
        color={'textTitle.light'}
        rightIcon={<Icon as={BsChevronDown} size="11px" color={'textCaption.light'} />}
        _hover={{ backgroundColor: colorMode === 'light' ? 'white' : 'transparent' }}
      >
        Links
      </MenuButton>
      <MenuList>
        {[
          { title: 'Websites', links: props.links.websites },
          { title: 'Blockchain', links: props.links.blockchain },
          { title: 'Chat', links: props.links.chat },
          { title: 'Forums', links: props.links.forums },
          { title: 'Announcements', links: props.links.announcements },
          { title: 'Repos', links: props.links.repos },
          { title: 'Social', links: props.links.social },
        ].map((group, i, arr) => (
          <React.Fragment key={group.title}>
            <LinksGroup title={group.title} links={group.links} />
            {group.links.length > 0 && i < arr.length - 1 && arr[i + 1].links.length > 0 && (
              <MenuDivider />
            )}
          </React.Fragment>
        ))}
      </MenuList>
    </Menu>
  );
}
