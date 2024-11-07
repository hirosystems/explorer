import { Flex, Icon, Image, Stack } from '@chakra-ui/react';
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
    <DialogRoot open={isOpen} onOpenChange={value => (!value.open ? handleClose() : null)}>
      <DialogBackdrop />
      <DialogContent width={'762px'} maxWidth={'full'}>
        <DialogCloseTrigger
          onClick={() => console.log('close trigger clicked')}
          _focus={{
            boxShadow: 'none',
          }}
        />
        <DialogBody pt={12}>
          <Stack alignItems={'center'} gap={6}>
            <Text fontSize={'4xl'} textAlign={'center'}>
              ✨ sBTC is here ✨
            </Text>
            <Image src={'/sbtc.png'} alt={'sBTC'} />
            <Text>sBTC is live! You can now put your Bitcoin to work in DeFi apps.</Text>
            <ButtonLink
              buttonProps={{
                variant: 'primary',
                onClick: () => {
                  handleClose();
                  void queryClient.clear();
                },
                bg: 'accent.stacks-500',
                _hover: {
                  textDecoration: 'none',
                },
              }}
              linkProps={{ color: 'white', href: 'https://app.stacks.co/' }}
              isExternal={true}
            >
              Mint sBTC
            </ButtonLink>
            <DialogFooter
              borderTop={'1px solid var(--stacks-colors-border-primary)'}
              width={'full'}
              justifyContent={'center'}
            >
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
                <Icon h={3} w={3} color="accent.stacks-500">
                  <ArrowUpRight />
                </Icon>
              </Flex>
            </DialogFooter>
          </Stack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
