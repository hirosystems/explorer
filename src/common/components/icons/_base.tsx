// import { Box, BoxProps } from '../../../ui/Box';
import { Icon, IconProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type SvgProps = React.FC<IconProps>;

export const BaseSvg = forwardRef<SVGSVGElement, IconProps>(
  (
    { as = 'svg', ...rest },
    ref // TODO: upgrade to v3. this may be broken
  ) => (
    <Icon
      as={as}
      width="44px"
      height="auto"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      ref={ref}
      {...rest}
    />
  )
);
