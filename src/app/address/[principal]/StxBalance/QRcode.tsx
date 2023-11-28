import vkQr from '@vkontakte/vk-qr';
import * as React from 'react';

import { Box, BoxProps } from '../../../../ui/Box';

export const QRcode: React.FC<{ address: string } & BoxProps> = React.memo(
  ({ address, ...rest }) => {
    const qrSvg = React.useMemo(
      () =>
        vkQr.createQR(address, {
          qrSize: 256,
          isShowLogo: true,
          logoData: '/stx-square.svg',
          foregroundColor: 'invert',
        }),
      [address]
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
  }
);
