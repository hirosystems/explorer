import React, { memo, useCallback } from 'react';
import { Box, color, ControlledModal, Flex, Button, IconButton, Stack } from '@stacks/ui';
import { IconChevronDown, IconChevronUp, IconX } from '@tabler/icons';
import { Caption, Text, Title } from '@components/typography';
import { useModal } from '@common/hooks/use-modal';
import { MODALS } from '@common/constants';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { useToggle } from 'react-use';
import { useNetwork } from '@common/hooks/use-network';
import { useSetChainMode } from '@common/hooks/use-chain-mode';
import { getInvertedChainMode } from '@common/utils';
import { useLoading } from '@common/hooks/use-loading';

const HelperInfo: React.FC = memo(() => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  return (
    <>
      <Flex
        alignItems="center"
        mt="base"
        onClick={toggleIsOpen}
        color={color('text-caption')}
        _hover={{
          color: color('text-title'),
          cursor: 'pointer',
        }}
      >
        <Flex alignItems="center">
          <Caption color="currentColor">What's the difference?</Caption>
        </Flex>
        <IconButton
          ml="extra-tight"
          color={color('text-caption')}
          size="24px"
          iconSize="16px"
          title={isOpen ? 'Hide' : 'Show info'}
          iconProps={{
            strokeWidth: 1.5,
          }}
          icon={isOpen ? IconChevronUp : IconChevronDown}
        />
      </Flex>
      {isOpen ? (
        <Text fontSize={1} color={color('text-body')} lineHeight="22px" mt="base">
          "Testnet" is an instance of the Stacks Blockchain that uses identical software as the
          "Mainnet" version. However, on "testnet", STX and transactions are used for testing where
          users can request STX, send transactions, and test and deploy smart contracts to ensure
          everything works as expected before deploying them on the "mainnet" Stacks Blockchain.
          "Regtest" is an alternative version of the Testnet, but is confgured to process
          transactions faster. Regtest and Testnet can be subject to resets.
        </Text>
      ) : null}
    </>
  );
});

export const DifferentNetworkModal: React.FC = memo(() => {
  const { modal, handleCloseModal } = useModal();
  const { handleSetTestnet, handleSetMainnet, isSwitching } = useNetwork();
  const networkMode = useNetworkMode();
  const setChainMode = useSetChainMode();
  const { isLoading, doStartLoading } = useLoading();

  const isOpen = modal === MODALS.DIFFERENT_NETWORK && !isSwitching;
  const inverted = networkMode && getInvertedChainMode(networkMode);

  const handleClose = useCallback(() => {
    handleCloseModal();
    networkMode && setChainMode(networkMode);
  }, [networkMode, setChainMode, handleCloseModal]);

  const handleClick = useCallback(() => {
    doStartLoading();
    if (inverted === 'testnet') {
      handleSetTestnet();
    } else {
      handleSetMainnet();
    }
  }, [inverted, handleSetMainnet, handleSetTestnet]);

  return (
    <ControlledModal minWidth="428px" bg={color('bg')} isOpen={isOpen} handleClose={handleClose}>
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        p="extra-loose"
        pb="base"
      >
        <Title fontSize={4}>Switch to {inverted}?</Title>
        <IconButton color={color('text-caption')} onClick={handleClose} icon={IconX} />
      </Flex>

      <Box mb="extra-loose" px="extra-loose">
        <Text fontSize={1} color={color('text-body')} lineHeight="22px">
          The URL you're on is for the {networkMode} version of the Stacks Blockchain. Do you want
          to update your network version to {networkMode === 'testnet' ? 'mainnet' : 'testnet'}?
        </Text>
        <HelperInfo />
        <Stack mt="base-loose" spacing="base">
          <Button isLoading={isLoading} width="100%" onClick={handleClick}>
            Switch to {inverted}
          </Button>
          <Button onClick={handleClose} mode="secondary" width="100%">
            Stay on {networkMode}
          </Button>
        </Stack>
      </Box>
    </ControlledModal>
  );
});
