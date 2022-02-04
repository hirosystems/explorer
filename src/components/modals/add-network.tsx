import React from 'react';
import { Box, color, ControlledModal, Flex, IconButton, Stack } from '@stacks/ui';
import { IconX } from '@tabler/icons';
import { Link, Text, Title } from '@components/typography';
import { closeModal, selectOpenedModal } from '@components/modals/modalSlice';
import { AddNetworkForm } from '@components/add-network-form';
import { useNetworkAddForm } from '@common/hooks/use-network-add-form';
import { MODALS } from '@common/constants';
import { useAppDispatch } from '@common/state/hooks';

export const AddNetworkModal: React.FC = () => {
  const modal = selectOpenedModal();
  const dispatch = useAppDispatch();
  const { setErrors } = useNetworkAddForm();
  const isOpen = modal === MODALS.ADD_NETWORK;
  const handleClose = () => {
    setErrors({});
    dispatch(closeModal());
  };
  return (
    <ControlledModal minWidth="428px" bg={color('bg')} isOpen={isOpen} handleClose={handleClose}>
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        p="extra-loose"
        pb="base"
      >
        <Title fontSize={4}>Add a network</Title>
        <IconButton color={color('text-caption')} onClick={handleClose} icon={IconX} />
      </Flex>
      <Stack spacing="base">
        <Box px="extra-loose">
          <Text fontSize={1} color={color('text-body')} lineHeight="22px">
            Use this form to add a new instance of the{' '}
            <Link
              display="inline"
              as="a"
              href="https://github.com/blockstack/stacks-blockchain-api"
              target="_blank"
              color={color('accent')}
            >
              Stacks Blockchain API
            </Link>
            . Make sure you review and trust the host before you add it.
          </Text>
        </Box>
        {modal && <AddNetworkForm />}
      </Stack>
    </ControlledModal>
  );
};
