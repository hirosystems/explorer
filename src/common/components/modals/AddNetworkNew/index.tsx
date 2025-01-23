import { RedesignModal } from '@/ui/RedesignModal';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { Warning } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { Text } from '../../../../ui/Text';
import { MODALS } from '../../../constants/constants';
import { useOpenedModal } from '../modal-slice';
import { AddNetworkFormNew } from './AddNetworkFormNew';

const AddNetworkModalBody = () => (
  <Stack gap={5}>
    <Stack gap={3}>
      <Text fontSize={'sm'} fontFamily="instrument" fontWeight="regular">
        Add a new instance of the Stacks Blockchain API.
      </Text>
      <Flex
        bg={{ base: 'red.100', _dark: 'transparent' }}
        borderRadius="redesign.md"
        px={4}
        py={3}
        gap={2}
        alignItems="center"
        border={{ base: 'none', _dark: '1px solid var(--stacks-colors-feedback-red-400)' }}
      >
        <Icon h={4} w={4} color="iconError">
          <Warning />
        </Icon>
        <Text fontSize={'sm'} fontFamily="matter" fontWeight="regular">
          Make sure you review and trust the host before you add it.
        </Text>
      </Flex>
    </Stack>
    <AddNetworkFormNew />
  </Stack>
);

export const AddNetworkModalNew = () => {
  const modal = useOpenedModal();
  const open = useMemo(() => modal === MODALS.ADD_NETWORK_NEW, [modal]);

  return (
    <RedesignModal
      open={open}
      title={
        <Text fontSize={'3.5xl'} fontFamily="matter" fontWeight="regular">
          Add a network
        </Text>
      }
      body={<AddNetworkModalBody />}
    />
  );
};
