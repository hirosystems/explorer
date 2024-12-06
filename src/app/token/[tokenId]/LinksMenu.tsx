import { Flex, Menu, Separator } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import React from 'react';

import { useColorMode } from '../../../components/ui/color-mode';
import { Button } from '../../../ui/Button';
import { Icon } from '../../../ui/Icon';
import { LinksGroup } from './LinksGroup';
import { TokenLinks } from './types';

export function LinksMenu(props: { links: TokenLinks }) {
  const colorMode = useColorMode().colorMode;

  return (
    <Menu.Root>
      <Menu.Trigger
        as={Button}
        backgroundColor={colorMode === 'light' ? 'white' : 'transparent'}
        layerStyle={colorMode === 'light' ? undefined : 'outline'} // TODO: v3 upgrade. this might be broken
        color={'textTitle.light'}
        _hover={{ backgroundColor: colorMode === 'light' ? 'white' : 'transparent' }}
      >
        <Flex alignItems="center" justifyContent="space-between" gap={2}>
          Links
          <Icon size="11px" color={'textCaption.light'}>
            <CaretDown />
          </Icon>
        </Flex>
      </Menu.Trigger>
      <Menu.Content>
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
              <Separator />
            )}
          </React.Fragment>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}
