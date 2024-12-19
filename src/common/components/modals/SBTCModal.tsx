import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Icon } from '../../..//ui/Icon';
import { ButtonLink } from '../../../ui/ButtonLink';
import { Flex } from '../../../ui/Flex';
import { Image } from '../../../ui/Image';
import { Modal } from '../../../ui/Modal';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';

export function SBTCModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sbtcModalShown = localStorage.getItem('sbtcModalShown');
    try {
      const dismissQueryParam = new URLSearchParams(window.location.search).get('dismiss');
      // to run performance testing without the modal
      if (dismissQueryParam === 'sbtc') {
        return;
      }
    } catch (e) {}
    if (!sbtcModalShown || sbtcModalShown === 'false') {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('sbtcModalShown', 'true');
    setIsOpen(false);
  };

  const queryClient = useQueryClient();

  return (
    <Modal title={'sBTC'} isOpen={isOpen} onClose={() => handleClose()}>
      <ModalOverlay />
      <ModalContent width={'762px'} maxWidth={'full'}>
        <ModalCloseButton
          _focus={{
            boxShadow: 'none',
          }}
        />
        <ModalBody pt={12}>
          <Stack alignItems={'center'} gap={6}>
            <Text fontSize={'4xl'} textAlign={'center'}>
              ✨ sBTC is here ✨
            </Text>
            <Image src={'/sbtc.png'} alt={'sBTC'} />
            <Text>sBTC is live! You can now put your Bitcoin to work in DeFi apps.</Text>
            <ButtonLink
              variant={'primary'}
              href={'https://app.stacks.co/'}
              onClick={() => {
                handleClose();
                void queryClient.clear();
              }}
              _hover={{ textDecoration: 'none' }}
              bg="accent.stacks-500"
            >
              Mint sBTC
            </ButtonLink>
            <ModalFooter borderTop={'1px'} width={'full'} justifyContent={'center'}>
              <Flex alignItems="center" gap={1}>
                <TextLink
                  color="accent.stacks-500"
                  href={
                    'https://explorer.hiro.so/token/SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token?chain=mainnet'
                  }
                  fontSize={'sm'}
                  target={'_blank'}
                >
                  See sBTC in the Explorer
                </TextLink>
                <Icon as={ArrowUpRight} size={3} color="accent.stacks-500" />
              </Flex>
            </ModalFooter>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
