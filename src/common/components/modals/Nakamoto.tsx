import { Flex, Icon, Image } from '@chakra-ui/react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from '../../../components/ui/dialog';
import { ButtonLink } from '../../../ui/ButtonLink';
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
    <DialogRoot open={isOpen} onExitComplete={() => handleClose()}>
      <DialogBackdrop />
      <DialogContent width={'762px'} maxWidth={'full'}>
        <DialogCloseTrigger
          _focus={{
            boxShadow: 'none',
          }}
        />
        <DialogBody pt={'12'}>
          <Flex direction={'column'} alignItems={'center'} gap={'6'}>
            <Text fontSize={'4xl'} textAlign={'center'}>
              Nakamoto 3.0 is live on Stacks Mainnet
            </Text>
            <Image src={'/nakamoto-mainnet.png'} alt={'Nakamoto'} />
            <ButtonLink
              buttonProps={{
                onClick: () => {
                  handleClose();
                  void queryClient.clear();
                },
                variant: 'primary',
                bg: 'accent.stacks-500',
                _hover: {
                  textDecoration: 'none',
                },
              }}
              linkProps={{
                href: '/',
              }}
            >
              Experience Fast Blocks and Bitcoin Finality
            </ButtonLink>
            <DialogFooter
              borderTop={`1px solid var(--stacks-colors-border-secondary)`}
              width={'full'}
              justifyContent={'center'}
            >
              <Flex alignItems="center" gap={1}>
                <TextLink
                  color="accent.stacks-500"
                  href={'https://stacks.org/Nakamoto'}
                  fontSize={'sm'}
                  target={'_blank'}
                >
                  Learn more about Nakamoto on Mainnet
                </TextLink>
                <Icon h={3} w={3} color="accent.stacks-500">
                  <ArrowUpRight />
                </Icon>
              </Flex>
            </DialogFooter>
          </Flex>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
