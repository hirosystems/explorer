import vkQr from '@vkontakte/vk-qr';
import * as React from 'react';

import { Box, BoxProps } from '../../../../ui/Box';
import { useColorModeValue } from '@/components/ui/color-mode';

export const QRcode = ({ address, ...rest }: { address: string } & BoxProps) => {
  const qrCodeColor = useColorModeValue('black', 'white');
  const qrSvg = React.useMemo(
    () =>
      vkQr.createQR(address, {
        qrSize: 256,
        isShowLogo: true,
        logoData: '/stx-square.svg',
        foregroundColor: qrCodeColor,
      }),
    [address, qrCodeColor]
  );

  const qr = <Box dangerouslySetInnerHTML={{ __html: qrSvg }} />;

  return (
    <Box position="relative" mx="auto" {...rest}>
      {qr}
      <Box position="absolute" left={0} top={0}>
        {qr}
      </Box>
    </Box>
  );
};
