'use client';

import { Input } from '@/ui/Input';
import { Box, Flex, FlexProps, Icon, useDisclosure } from '@chakra-ui/react';
import { List } from '@phosphor-icons/react';

import { FeePopover } from './FeePopover';
import { Logo } from './Logo';
import { MobileNavPage } from './MobileNavPage';
import { PagesSlidingMenu } from './PagesSlidingMenu';
import { SettingsPopover } from './SettingsPopover';

const DesktopNavBar = (props: any) => {
  return (
    <Flex
      width="full"
      h={10}
      alignItems="center"
      justifyContent="space-between"
      {...props}
      gap={15}
    >
      <Flex alignItems="center" gap={4} h="full">
        <Logo logoSize={10} />
        <PagesSlidingMenu width={50} />
      </Flex>
      <Flex flexGrow={1} flexShrink={1} maxWidth="474px">
        <Input placeholder="Explore" bg="surfaceSecondary" variant="redesignPrimary" />
      </Flex>
      <Flex gap={4}>
        <FeePopover />
        <SettingsPopover />
      </Flex>
    </Flex>
  );
};

interface SharedMobileNavBarProps extends FlexProps {
  onIconClick: () => void;
  icon: React.ReactNode;
  iconHoverBg?: string;
}

export const SharedMobileNavBar = ({ onIconClick, icon, ...props }: SharedMobileNavBarProps) => {
  return (
    <Flex
      width="full"
      h={13}
      minH={13}
      maxH={13}
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Logo logoSize={9} ringsOn={true} />
      <Flex gap={3}>
        <Box flexGrow={1} flexShrink={1} maxWidth="150px" h={12}>
          <Input placeholder="Explore" bg="surfaceSecondary" h={12} variant="redesignPrimary" />
        </Box>
        <Flex
          bg="surfacePrimary"
          borderRadius="redesign.lg"
          p={2}
          h={12}
          w={12}
          alignItems="center"
          justifyContent="center"
          onClick={onIconClick}
          className="group"
          _hover={{
            bg: 'surfaceFifth',
          }}
        >
          <Icon
            h={5}
            w={5}
            color="iconSecondary"
            _groupHover={{
              color: 'iconPrimary',
            }}
          >
            {icon}
          </Icon>
        </Flex>
      </Flex>
    </Flex>
  );
};

const MobileNavBar = (props: any) => {
  const { open, onToggle } = useDisclosure();

  return (
    <>
      <SharedMobileNavBar onIconClick={onToggle} icon={<List />} {...props} />
      {open && <MobileNavPage onClose={onToggle} />}
    </>
  );
};

export function NavBar() {
  return (
    <Box fontFamily="var(--font-instrument-sans)">
      <DesktopNavBar hideBelow="lg" />
      <MobileNavBar hideFrom="lg" />
    </Box>
  );
}
