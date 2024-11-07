import { useColorMode } from '@/components/ui/color-mode';
import { Box, BoxProps, ClientOnly } from '@chakra-ui/react';
import vkQr from '@vkontakte/vk-qr';
import * as React from 'react';

export const QRcode = ({ address, ...rest }: { address: string } & BoxProps) => {
  const { colorMode } = useColorMode();

  const qrSvg = React.useMemo(
    () =>
      vkQr.createQR(address, {
        qrSize: 256,
        isShowLogo: true,
        logoData: '/stx-square.svg',
        foregroundColor: colorMode === 'light' ? 'black' : 'white',
      }),
    [address, colorMode]
  );

  const qr = <Box dangerouslySetInnerHTML={{ __html: qrSvg }} />;

  return (
    <ClientOnly>
      <Box position="relative" mx="auto" {...rest}>
        {qr}
        <Box position="absolute" left={0} top={0}>
          {qr}
        </Box>
      </Box>
    </ClientOnly>
  );
};
