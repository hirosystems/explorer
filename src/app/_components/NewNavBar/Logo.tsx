import StxIcon from '@/ui/icons/StxIcon';
import { Flex, Icon, IconProps } from '@chakra-ui/react';

import { ExplorerLink } from '../../../common/components/ExplorerLinks';

const logoBorderRadius = 8;
const ringThickness = 4;

function calculateRingBorderRadius(innerRadius: number, ringThickness: number): number {
  return innerRadius + ringThickness;
}

export function Logo({
  logoSize,
  ringsOn = false, // Shows the rings by default vs showing them only on hover
  includeRingsInSize = false,
  ...iconProps
}: IconProps & { logoSize: number; ringsOn?: boolean; includeRingsInSize?: boolean }) {
  const outerRingSize = logoSize + 4;
  const innerRingSize = logoSize + 2;

  const innerRingBorderRadius = calculateRingBorderRadius(logoBorderRadius, ringThickness);
  const outerRingBorderRadius = calculateRingBorderRadius(innerRingBorderRadius, ringThickness);

  return (
    <Flex
      position="relative"
      h={includeRingsInSize ? outerRingSize : logoSize}
      w={includeRingsInSize ? outerRingSize : logoSize}
    >
      <ExplorerLink href={'/'} title="Stacks Explorer" className="logo">
        <Flex
          h={logoSize}
          w={logoSize}
          bg="iconPrimary"
          borderRadius={`${logoBorderRadius}px`}
          justifyContent="center"
          alignItems="center"
          zIndex={2}
        >
          <Icon h={4.5} w={4.5} color="iconInvert" aria-label="Homepage" {...iconProps}>
            <StxIcon />
          </Icon>
        </Flex>
      </ExplorerLink>
      {/* Outer Ring */}
      <Flex
        className="ring"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={0}
        h={outerRingSize}
        w={outerRingSize}
        background={{
          _light: 'linear-gradient(to bottom, rgba(255, 209, 167, 0.4), rgba(255, 165, 127, 0.7));',
          _dark: 'linear-gradient(to bottom, rgba(225, 124, 24, 0.4), rgba(204, 73, 0, 0.7));',
        }}
        borderRadius={`${outerRingBorderRadius}px`}
        css={{
          opacity: ringsOn ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.48, 0, 0.83, 0.67)',
          '.logo:hover ~ &': {
            opacity: 1,
          },
        }}
      />
      {/* Inner Ring */}
      <Flex
        className="ring"
        position="absolute"
        top="50%"
        left="50%"
        zIndex={1}
        transform="translate(-50%, -50%)"
        h={innerRingSize}
        w={innerRingSize}
        background={{
          _light: 'linear-gradient(to bottom, rgba(255, 194, 136, 0.8), rgba(252, 100, 50, 0.8));',
          _dark: 'linear-gradient(to bottom, rgba(255, 152, 53, 0.7), rgba(252, 100, 50, 0.9));',
        }}
        borderRadius={`${innerRingBorderRadius}px`}
        opacity={ringsOn ? 1 : 0}
        transition="opacity 0.3s cubic-bezier(0.48, 0, 0.83, 0.67)"
        css={{
          opacity: ringsOn ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.48, 0, 0.83, 0.67)',
          '.logo:hover ~ &': {
            opacity: 1,
          },
        }}
      />
    </Flex>
  );
}
