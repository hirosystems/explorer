import { Modal } from '@/ui/Modal';
import { Box, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Text } from '../../../../ui/Text';
import { TextLink } from '../../../../ui/TextLink';
import { MODALS } from '../../../constants/constants';
import { useOpenedModal } from '../modal-slice';
import { AddNetworkForm } from './AddNetworkForm';

const AddNetworkModalBody = () => (
  <Stack gap={4}>
    <Box>
      <Text fontSize={'sm'}>
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
);

export const AddNetworkModal = () => {
  const modal = useOpenedModal();
  const open = useMemo(() => modal === MODALS.ADD_NETWORK, [modal]);

  return <Modal open={open} title={'Add a network'} body={<AddNetworkModalBody />} />;
};
