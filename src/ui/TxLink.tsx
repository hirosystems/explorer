import { Link } from '@chakra-ui/next-js';
import { useColorMode } from '@chakra-ui/react';
import { FC } from 'react';

import { Box, BoxProps } from './Box';

export const TxLink: FC<{ href?: string; openInNewTab?: boolean } & BoxProps> = ({
  href,
  openInNewTab = false,
  ...rest
}) => {
  const colorMode = useColorMode();

  return (
    <Box
      as={Link}
      href={href}
      {...(openInNewTab && { target: '_blank' })}
      textOverflow={'ellipsis'}
      overflow={'hidden'}
      whiteSpace={'nowrap'}
      display={'block'}
      color={`links.${colorMode}`}
      _hover={{ color: `links.${colorMode}`, textDecoration: 'underline' }}
      {...rest}
    />
  );
};
