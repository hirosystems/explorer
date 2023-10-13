import { MODALS } from '@/common/constants';
import { useAppDispatch } from '@/common/state/hooks';
import { AddNetworkForm } from './AddNetworkForm';
import { useOpenedModal } from '@/components/modals/modal-slice';
import { Box, Modal, Stack, TextLink } from '@/ui/components';
import { Text } from '@/ui/typography';
import { FC } from 'react';

export const AddNetworkModal: FC = () => {
  const modal = useOpenedModal();
  const dispatch = useAppDispatch();
  const isOpen = modal === MODALS.ADD_NETWORK;
  return (
    <Modal title={'Add a network'} isOpen={isOpen}>
      <Stack spacing="16px">
        <Box>
          <Text fontSize={'14px'} color={'textBody'}>
            Use this form to add a new instance of the{' '}
            <TextLink
              display="inline"
              as="a"
              href="https://github.com/blockstack/stacks-blockchain-api"
              target="_blank"
              color={'accent'}
            >
              Stacks Blockchain API
            </TextLink>
            . Make sure you review and trust the host before you add it.
          </Text>
        </Box>
        <AddNetworkForm />
      </Stack>
    </Modal>
  );
};
