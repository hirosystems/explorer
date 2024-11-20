import { Dialog } from '@chakra-ui/react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Icon } from '../../..//ui/Icon';
import { ButtonLink } from '../../../ui/ButtonLink';
import { Flex } from '../../../ui/Flex';
import { Image } from '../../../ui/Image';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';

export function NakamotoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const nakamotoModalShown = localStorage.getItem('nakamoto3MainnetModalShown');
    try {
      const dismissQueryParam = new URLSearchParams(window.location.search).get('dismiss');
      // to run performance testing without the modal
      if (dismissQueryParam === 'nakamoto') {
        return;
      }
    } catch (e) {}
    if (!nakamotoModalShown || nakamotoModalShown === 'false') {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('nakamoto3MainnetModalShown', 'true');
    setIsOpen(false);
  };

  const queryClient = useQueryClient();

  return (
    <Dialog.Root open={isOpen} onExitComplete={() => handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Content width={'762px'} maxWidth={'full'}>
        <Dialog.CloseTrigger
          _focus={{
            boxShadow: 'none',
          }}
        />
        <Dialog.Body pt={'12'}>
          <Flex direction={'column'} alignItems={'center'} gap={'6'}>
            <Text fontSize={'4xl'} textAlign={'center'}>
              Nakamoto 3.0 is live on Stacks Mainnet
            </Text>
            <Image src={'/nakamoto-mainnet.png'} alt={'Nakamoto'} />
            <ButtonLink
              visual={'primary'}
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
            <Dialog.Footer borderTop={'1px'} width={'full'} justifyContent={'center'}>
              <Flex alignItems="center" gap={1}>
                <TextLink
                  color="accent.stacks-500"
                  href={'https://stacks.org/Nakamoto'}
                  fontSize={'sm'}
                  target={'_blank'}
                >
                  Learn more about Nakamoto on Mainnet
                </TextLink>
                <Icon as={ArrowUpRight} size={3} color="accent.stacks-500">
                  <ArrowUpRight />
                </Icon>
              </Flex>
            </Dialog.Footer>
          </Flex>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}
