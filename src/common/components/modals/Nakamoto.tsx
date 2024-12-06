import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
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

export function NakamotoModal() {
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const nakamotoModalShown = localStorage.getItem('nakamoto3MainnetModalShown');
  //   try {
  //     const dismissQueryParam = new URLSearchParams(window.location.search).get('dismiss');
  //     // to run performance testing without the modal
  //     if (dismissQueryParam === 'nakamoto') {
  //       return;
  //     }
  //   } catch (e) {}
  //   if (!nakamotoModalShown || nakamotoModalShown === 'false') {
  //     setIsOpen(true);
  //   }
  // }, []);

  const handleClose = () => {
    localStorage.setItem('nakamoto3MainnetModalShown', 'true');
    setIsOpen(false);
  };

  const queryClient = useQueryClient();

  return (
    <Modal title={'Nakamoto'} isOpen={isOpen} onClose={() => handleClose()}>
      <ModalOverlay />
      <ModalContent width={'762px'} maxWidth={'full'}>
        <ModalCloseButton
          _focus={{
            boxShadow: 'none',
          }}
        />
        <ModalBody pt={'12'}>
          <Flex direction={'column'} alignItems={'center'} gap={'6'}>
            <Text fontSize={'4xl'} textAlign={'center'}>
              Nakamoto 3.0 is live on Stacks Mainnet
            </Text>
            <Image src={'/nakamoto-mainnet.png'} alt={'Nakamoto'} />
            <ButtonLink
              variant={'primary'}
              href={'/'}
              onClick={() => {
                handleClose();
                void queryClient.clear();
              }}
              _hover={{ textDecoration: 'none' }}
              bg="accent.stacks-500"
            >
              Experience Fast Blocks and Bitcoin Finality
            </ButtonLink>
            <ModalFooter borderTop={'1px'} width={'full'} justifyContent={'center'}>
              <Flex alignItems="center" gap={1}>
                <TextLink
                  color="accent.stacks-500"
                  href={'https://stacks.org/Nakamoto'}
                  fontSize={'sm'}
                  target={'_blank'}
                >
                  Learn more about Nakamoto on Mainnet
                </TextLink>
                <Icon as={ArrowUpRight} size={3} color="accent.stacks-500" />
              </Flex>
            </ModalFooter>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
