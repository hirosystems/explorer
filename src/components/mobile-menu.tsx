import { useColorMode } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { TbArrowLeft, TbMenu2, TbX } from 'react-icons/tb';
import { ColorModeButton } from '@/components/color-mode-button';
import { HeaderTextItem } from '@/components/header-text-item';
import { ExplorerLink } from '@/components/links';
import { NetworkItems } from '@/components/network-items';
import { Box, Flex, IconButton } from '@/ui/components';

enum Visibility {
  CLOSED = 'closed',
  OPEN = 'open',
}

type VisibilityState = Visibility.CLOSED | Visibility.OPEN;

enum Views {
  INDEX = 'index',
  NETWORK = 'network',
}

type ViewsState = Views.INDEX | Views.NETWORK;

function NetworkView({
  handleClose,
}: {
  handleSetNetworkView: () => void;
  handleSetIndexView: () => void;
  handleClose: () => void;
}) {
  return (
    <Box width="100%">
      <HeaderTextItem
        px="32px"
        color={`invert.${useColorMode().colorMode}`}
        mb="32px"
        fontSize="32px"
      >
        Switch network
      </HeaderTextItem>
      <NetworkItems
        onItemClick={() => {
          handleClose();
        }}
      />
    </Box>
  );
}

function IndexView({
  handleSetNetworkView,
  handleClose,
}: {
  handleClose: () => void;
  handleSetNetworkView: () => void;
  handleSetIndexView: () => void;
}) {
  return (
    <Flex flexDirection="column" alignItems="flex-end" px="32px">
      <ExplorerLink href="/">
        <HeaderTextItem
          color={`invert.${useColorMode().colorMode}`}
          mb="32px"
          fontSize="32px"
          onClick={handleClose}
        >
          Home
        </HeaderTextItem>
      </ExplorerLink>
      <ExplorerLink href="/transactions">
        <HeaderTextItem
          color={`invert.${useColorMode().colorMode}`}
          mb="32px"
          fontSize="32px"
          onClick={handleClose}
        >
          Transactions
        </HeaderTextItem>
      </ExplorerLink>
      <ExplorerLink href="/blocks">
        <HeaderTextItem
          color={`invert.${useColorMode().colorMode}`}
          mb="32px"
          fontSize="32px"
          onClick={handleClose}
        >
          Blocks
        </HeaderTextItem>
      </ExplorerLink>
      <ExplorerLink href="/sandbox/deploy">
        <HeaderTextItem
          color={`invert.${useColorMode().colorMode}`}
          mb="32px"
          fontSize="32px"
          onClick={handleClose}
        >
          Sandbox
        </HeaderTextItem>
      </ExplorerLink>
      <HeaderTextItem
        onClick={handleSetNetworkView}
        color={`invert.${useColorMode().colorMode}`}
        fontSize="32px"
      >
        Switch network
      </HeaderTextItem>
    </Flex>
  );
}

export function MobileMenu() {
  const [state, setState] = useState<VisibilityState>(Visibility.CLOSED);
  const [view, setView] = useState<ViewsState>(Views.INDEX);
  const isClosed = state === Visibility.CLOSED;
  const isOpen = state === Visibility.OPEN;
  const { colorMode } = useColorMode();

  const handleSetNetworkView = () => setView(Views.NETWORK);
  const handleSetIndexView = () => setView(Views.INDEX);

  const handleOpen = useCallback(() => {
    return setState(() => Visibility.OPEN);
  }, [setState]);

  const handleClose = useCallback(() => {
    setState(() => Visibility.CLOSED);
    setTimeout(() => {
      handleSetIndexView();
    }, 250);
  }, [setState]);

  return (
    <Box display={['block', 'block', 'block', 'none']} zIndex={3}>
      <IconButton
        size="42px"
        onClick={handleOpen}
        color="white"
        icon={<TbMenu2 size="24px" />}
        aria-label="Open menu"
      />
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          height="100vh"
          width="100vw"
          bg="rgba(0,0,0,0.5)"
          pointerEvents={isClosed ? 'none' : 'all'}
        >
          <Flex
            flexDirection="column"
            alignItems="flex-end"
            py="32px"
            bg={`bg.${colorMode}`}
            borderLeftWidth="1px"
            width="90vw"
            ml="10vw"
            height="100vh"
          >
            <Flex px="32px" width="100%" justifyContent="space-between" mb="32px">
              {view === Views.NETWORK ? (
                <IconButton
                  onClick={handleSetIndexView}
                  size="48px"
                  color={`invert.${colorMode}`}
                  icon={<TbArrowLeft size="32px" />}
                  aria-label="Network"
                />
              ) : (
                <ColorModeButton
                  color={`invert.${colorMode}`}
                  size="48px"
                  aria-label="Change color mode"
                />
              )}
              <IconButton
                onClick={handleClose}
                size="48px"
                color={`invert.${colorMode}`}
                icon={<TbX size="32px" />}
                aria-label="Close menu"
              />
            </Flex>
            {view === Views.NETWORK ? (
              <NetworkView
                handleSetNetworkView={handleSetNetworkView}
                handleSetIndexView={handleSetIndexView}
                handleClose={handleClose}
              />
            ) : (
              <IndexView
                handleSetNetworkView={handleSetNetworkView}
                handleSetIndexView={handleSetIndexView}
                handleClose={handleClose}
              />
            )}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
