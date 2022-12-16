import { IconArrowLeft, IconMenu2, IconX } from '@tabler/icons';
import dynamic from 'next/dynamic';
import React from 'react';

import { Box, Fade, Flex, IconButton, color } from '@stacks/ui';

import { useLockBodyScroll } from '@common/hooks/use-lock-body-scroll';
import { border } from '@common/utils';

import { HeaderTextItem } from '@components/header-text-item';
import { ExplorerLink } from '@components/links';
import { NetworkItems } from '@components/network-items';

const ColorModeButton = dynamic(() => import('@components/color-mode-button'), { ssr: false });

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

const NetworkView: React.FC<{
  handleSetNetworkView: () => void;
  handleSetIndexView: () => void;
  handleClose: () => void;
}> = ({ handleSetIndexView, handleClose }) => (
  <Box width="100%">
    <HeaderTextItem px="extra-loose" color={color('invert')} mb="extra-loose" fontSize={6}>
      Switch network
    </HeaderTextItem>
    <NetworkItems
      onItemClick={() => {
        handleClose();
      }}
    />
  </Box>
);

const IndexView: React.FC<{
  handleClose: () => void;
  handleSetNetworkView: () => void;
  handleSetIndexView: () => void;
}> = ({ handleSetNetworkView, handleClose }) => (
  <Flex flexDirection="column" alignItems="flex-end" px="extra-loose">
    <ExplorerLink path={'/'}>
      <HeaderTextItem color={color('invert')} mb="extra-loose" fontSize={6} onClick={handleClose}>
        Home
      </HeaderTextItem>
    </ExplorerLink>
    <ExplorerLink path={'/transactions'}>
      <HeaderTextItem color={color('invert')} mb="extra-loose" fontSize={6} onClick={handleClose}>
        Transactions
      </HeaderTextItem>
    </ExplorerLink>
    <ExplorerLink path={'/blocks'}>
      <HeaderTextItem color={color('invert')} mb="extra-loose" fontSize={6} onClick={handleClose}>
        Blocks
      </HeaderTextItem>
    </ExplorerLink>
    <ExplorerLink path={'/sandbox/deploy'}>
      <HeaderTextItem color={color('invert')} mb="extra-loose" fontSize={6} onClick={handleClose}>
        Sandbox
      </HeaderTextItem>
    </ExplorerLink>
    <HeaderTextItem onClick={handleSetNetworkView} color={color('invert')} fontSize={6}>
      Switch network
    </HeaderTextItem>
  </Flex>
);

export const MobileMenu: React.FC = () => {
  const [state, setState] = React.useState<VisibilityState>(Visibility.CLOSED);
  const [view, setView] = React.useState<ViewsState>(Views.INDEX);
  const isClosed = state === Visibility.CLOSED;
  const isOpen = state === Visibility.OPEN;

  const handleSetNetworkView = () => setView(Views.NETWORK);
  const handleSetIndexView = () => setView(Views.INDEX);

  const handleOpen = React.useCallback(() => {
    return setState(() => Visibility.OPEN);
  }, [setState]);

  const handleClose = React.useCallback(() => {
    setState(() => Visibility.CLOSED);
    setTimeout(() => {
      handleSetIndexView();
    }, 250);
  }, [setState]);

  useLockBodyScroll(isOpen, true);

  return (
    <Box display={['block', 'block', 'block', 'none']}>
      <IconButton
        size="42px"
        iconSize="24px"
        onClick={handleOpen}
        invert
        color="white"
        icon={IconMenu2}
      />
      <Fade in={isOpen}>
        {styles => (
          <>
            <Box
              position="fixed"
              top={0}
              left={0}
              height="100vh"
              width="100vw"
              bg="rgba(0,0,0,0.5)"
              style={styles}
              pointerEvents={isClosed ? 'none' : 'all'}
              zIndex={9999}
            >
              <Flex
                flexDirection="column"
                alignItems="flex-end"
                py="extra-loose"
                bg={color('bg')}
                borderLeft={border()}
                width="90vw"
                ml="10vw"
                height="100vh"
              >
                <Flex px="extra-loose" width="100%" justifyContent="space-between" mb="extra-loose">
                  {view === Views.NETWORK ? (
                    <IconButton
                      onClick={handleSetIndexView}
                      size="48px"
                      iconSize="32px"
                      color={color('invert')}
                      icon={IconArrowLeft}
                    />
                  ) : (
                    <ColorModeButton
                      invert={false}
                      color={color('invert')}
                      size="48px"
                      iconSize="32px"
                    />
                  )}
                  <IconButton
                    onClick={handleClose}
                    size="48px"
                    iconSize="32px"
                    color={color('invert')}
                    icon={IconX}
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
          </>
        )}
      </Fade>
    </Box>
  );
};
