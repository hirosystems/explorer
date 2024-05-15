import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Badge } from '../../../ui/Badge';
import { ButtonLink } from '../../../ui/ButtonLink';
import { Flex } from '../../../ui/Flex';
import { Image } from '../../../ui/Image';
import { Modal } from '../../../ui/Modal';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';

export function NakamotoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const nakamotoModalShown = localStorage.getItem('nakamoto25ModalShown');
    try {
      const dismissQueryParam = new URLSearchParams(window.location.search).get('dismiss');
      // to run performance testing without the modal
      if (dismissQueryParam === 'nakamoto') {
        return;
      }
    } catch (e) {}
    // TODO: temporarily disable the modal
    // if (!nakamotoModalShown || nakamotoModalShown === 'false') {
    //   setIsOpen(true);
    // }
  }, []);

  const handleClose = () => {
    localStorage.setItem('nakamoto25ModalShown', 'true');
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
            <Badge
              color={'purple.600'}
              bg={'purple.100'}
              px={'2'}
              py={'1'}
              fontSize={'xs'}
              rounded={'full'}
              border={'1px'}
              borderColor={'purple.300'}
              fontWeight={'medium'}
            >
              NAKAMOTO UPGRADE
            </Badge>
            <Text fontSize={'4xl'} textAlign={'center'}>
              Nakamoto 2.5 is live on Mainnet! 🎉
            </Text>
            <Image src={'/nakamoto.png'} alt={'Nakamoto'} />
            <ButtonLink
              variant={'primary'}
              href={'/?chain=mainnet'}
              onClick={() => {
                handleClose();
                void queryClient.clear();
              }}
              _hover={{ textDecoration: 'none' }}
            >
              Explore Nakamoto
            </ButtonLink>
            <ModalFooter borderTop={'1px'} width={'full'} justifyContent={'center'}>
              <TextLink
                color={'purple.600'}
                href={'https://docs.hiro.so/nakamoto'}
                fontSize={'sm'}
                target={'_blank'}
              >
                Learn more about Nakamoto ↗
              </TextLink>
            </ModalFooter>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
