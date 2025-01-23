import { Text } from '@/ui/Text';
import { Box, Flex, Icon, Stack, useDisclosure } from '@chakra-ui/react';
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

import { FeePopoverContent } from './FeePopover';
import { SharedMobileNavBar } from './NavBar';
import { PrimaryPageLink, SecondaryPageLink } from './PagesLinks';
import { SettingsPopoverContent } from './SettingsPopover';
import { primaryPages, secondaryPages } from './consts';

const topOpacityDuration = 0.3;

const MobileContentTop = ({
  isFeesMenuOpen,
  isSettingsMenuOpen,
}: {
  isFeesMenuOpen: boolean;
  isSettingsMenuOpen: boolean;
}) => {
  return (
    <Box position="relative">
      <AnimatePresence>
        <motion.div
          key="pages"
          initial={{ opacity: 1 }}
          animate={{
            opacity: isFeesMenuOpen || isSettingsMenuOpen ? 0 : 1,
            pointerEvents: isFeesMenuOpen || isSettingsMenuOpen ? 'none' : 'auto',
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            opacity: { duration: topOpacityDuration },
          }}
        >
          <Box position="absolute" top={0} left={0} w="full">
            {primaryPages.map(page => (
              <PrimaryPageLink page={page} />
            ))}
          </Box>
        </motion.div>

        <motion.div
          key="fees-menu"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isFeesMenuOpen ? 1 : 0,
            pointerEvents: isFeesMenuOpen ? 'auto' : 'none',
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            opacity: { duration: topOpacityDuration },
          }}
        >
          <Box position="absolute" top={0} left={0} w="full">
            <FeePopoverContent />
          </Box>
        </motion.div>

        <motion.div
          key="settings-menu"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isSettingsMenuOpen ? 1 : 0,
            pointerEvents: isSettingsMenuOpen ? 'auto' : 'none',
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            opacity: { duration: topOpacityDuration },
          }}
        >
          <Box position="relative">
            <Box position="absolute" top={0} left={0} w="full">
              <SettingsPopoverContent />
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

const bottomOpacityDuration = 0.3;
const bottomXYDuration = 0.3;

const MobileContentBottom = ({
  isFeesMenuOpen,
  isSettingsMenuOpen,
  toggleFeesMenu,
  toggleSettingsMenu,
}: {
  isFeesMenuOpen: boolean;
  isSettingsMenuOpen: boolean;
  toggleFeesMenu: () => void;
  toggleSettingsMenu: () => void;
}) => {
  return (
    <AnimatePresence mode="wait">
      <Box position="relative">
        <motion.div // this represents the bottom state when no menus have been opened. it should fade out when a menu is opened
          key={'bottom-menus'}
          initial={{ opacity: 1 }}
          animate={{
            opacity: isFeesMenuOpen || isSettingsMenuOpen ? 0 : 1,
            y: isFeesMenuOpen || isSettingsMenuOpen ? 100 : 0,
            pointerEvents: isFeesMenuOpen || isSettingsMenuOpen ? 'none' : 'auto',
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            opacity: { duration: bottomOpacityDuration },
            y: { duration: bottomXYDuration },
          }}
        >
          <Stack gap={4} position="absolute" bottom={0} left={0} w="full">
            <Stack gap={2}>
              <Flex
                bg="surfacePrimary"
                borderRadius="redesign.lg"
                px={4}
                gap={3}
                h={14}
                alignItems="center"
                justifyContent="space-between"
                onClick={toggleFeesMenu}
                cursor="pointer"
              >
                <Flex alignItems="baseline" gap={2}>
                  <Text fontSize="md" color="textSecondary">
                    Fees:
                  </Text>
                  <Text fontSize="md" fontFamily="var(--font-matter-mono)">
                    0.18 STX
                  </Text>
                </Flex>
                <motion.div // this is for sending the caret right icon to the left when the menu is opened
                  key={'fees-menu-button-caret-right'}
                  animate={{ x: isFeesMenuOpen ? -200 : 0, opacity: isFeesMenuOpen ? 0 : 1 }}
                  transition={{
                    opacity: { duration: bottomOpacityDuration },
                    x: { duration: bottomXYDuration },
                  }}
                >
                  <Icon>{isFeesMenuOpen ? <CaretLeft /> : <CaretRight />}</Icon>
                </motion.div>
              </Flex>
              <Flex
                bg="surfacePrimary"
                borderRadius="redesign.lg"
                px={4}
                gap={3}
                h={14}
                alignItems="center"
                justifyContent="space-between"
                onClick={toggleSettingsMenu}
                cursor="pointer"
              >
                <Text fontSize="md" color="textSecondary">
                  Settings
                </Text>
                <motion.div // this is for sending the caret right icon to the left when the menu is opened
                  key={'settings-menu-button-caret-right'}
                  animate={{
                    x: isSettingsMenuOpen ? -200 : 0,
                    opacity: isSettingsMenuOpen ? 0 : 1,
                  }}
                  transition={{
                    opacity: { duration: bottomOpacityDuration },
                    x: { duration: bottomXYDuration },
                  }}
                >
                  <Icon>{isSettingsMenuOpen ? <CaretLeft /> : <CaretRight />}</Icon>
                </motion.div>
              </Flex>
            </Stack>
            <Stack gap={3}>
              {secondaryPages.map(page => (
                <SecondaryPageLink page={page} />
              ))}
            </Stack>
          </Stack>
        </motion.div>

        <motion.div // when either menu is open, this back button should fade in
          key={'go-back'}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isFeesMenuOpen || isSettingsMenuOpen ? 1 : 0,
            pointerEvents: isFeesMenuOpen || isSettingsMenuOpen ? 'auto' : 'none',
            y: isFeesMenuOpen || isSettingsMenuOpen ? 0 : -10,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: bottomOpacityDuration }}
        >
          <Flex
            position="absolute"
            bottom={0}
            left={0}
            bg="surfacePrimary"
            w="full"
            borderRadius="redesign.lg"
            px={4}
            gap={1}
            h={14}
            alignItems="center"
            onClick={isFeesMenuOpen ? toggleFeesMenu : toggleSettingsMenu}
          >
            <motion.div
              key={'go-back-button-caret-left'}
              animate={{
                x: isSettingsMenuOpen || isFeesMenuOpen ? 0 : 200,
                opacity: isSettingsMenuOpen || isFeesMenuOpen ? 1 : 0,
              }}
              transition={{
                opacity: { duration: bottomOpacityDuration },
                x: { duration: bottomXYDuration },
              }}
            >
              <Flex alignItems="center">
                <Icon color="textSecondary">
                  <CaretLeft />
                </Icon>
              </Flex>
            </motion.div>
            <Text fontSize="md" color="textSecondary">
              Back
            </Text>
          </Flex>
        </motion.div>
      </Box>
    </AnimatePresence>
  );
};

export const MobileNavPage = ({ onClose }: { onClose: () => void }) => {
  const {
    open: isFeesMenuOpen,
    onToggle: toggleFeesMenu,
    onClose: closeFeesMenuOpen,
  } = useDisclosure();
  const {
    open: isSettingsMenuOpen,
    onToggle: toggleSettingsMenu,
    onClose: closeSettingsMenuOpen,
  } = useDisclosure();

  // only one menu can be open at a time
  useEffect(() => {
    if (isFeesMenuOpen) {
      closeSettingsMenuOpen();
    }
    if (isSettingsMenuOpen) {
      closeFeesMenuOpen();
    }
  }, [isFeesMenuOpen, isSettingsMenuOpen, closeSettingsMenuOpen, closeFeesMenuOpen]);

  const handleScroll = (event: Event) => {
    event.preventDefault();
  };

  // Disable scrolling when the menu is open
  useEffect(() => {
    if (document.body) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('scroll', handleScroll, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <Stack
      position="fixed"
      height="full"
      width="full"
      backgroundColor="surfaceTertiary"
      top={0}
      left={0}
      zIndex={'overlay'}
      gap={4}
      padding={6}
      overflow="hidden"
    >
      <SharedMobileNavBar onIconClick={onClose} icon={<X />} />
      <Stack justifyContent="space-between" height="full">
        <MobileContentTop isFeesMenuOpen={isFeesMenuOpen} isSettingsMenuOpen={isSettingsMenuOpen} />
        <MobileContentBottom
          isFeesMenuOpen={isFeesMenuOpen}
          isSettingsMenuOpen={isSettingsMenuOpen}
          toggleFeesMenu={toggleFeesMenu}
          toggleSettingsMenu={toggleSettingsMenu}
        />
      </Stack>
    </Stack>
  );
};
