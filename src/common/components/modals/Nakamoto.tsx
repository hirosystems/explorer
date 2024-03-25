import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';
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
    const nakamotoModalShown = localStorage.getItem('nakamotoModalShown');
    if (!nakamotoModalShown || nakamotoModalShown === 'false') {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('nakamotoModalShown', 'true');
    setIsOpen(false);
  };

  return (
    <Modal title={'Nakamoto'} isOpen={isOpen} onClose={() => handleClose()}>
      <ModalOverlay />
      <ModalContent width={'762px'} maxWidth={'full'}>
        <ModalCloseButton />
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
              ✨A glimpse into Nakamoto✨
            </Text>
            <Image src={'/nakamoto.png'} alt={'Nakamoto'} />
            <Text fontSize={'md'} textAlign={'center'}>
              Use the Explorer on Testnet to see how Blocks will behave on the Nakamoto upgrade.
            </Text>
            <ButtonLink
              variant={'primary'}
              href={'/?chain=testnet&api=https://api.nakamoto.testnet.hiro.so'}
              onClick={handleClose}
              _hover={{ textDecoration: 'none' }}
            >
              Switch to Testnet
            </ButtonLink>
            <ModalFooter borderTop={'1px'} width={'full'} justifyContent={'center'}>
              <TextLink color={'purple.600'} href={'https://docs.hiro.so/nakamoto'} fontSize={'sm'}>
                Learn more about Nakamoto Testnet ↗
              </TextLink>
            </ModalFooter>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
