import { Box, Flex } from '@chakra-ui/react';

import { Link } from '../../../ui/Link';
import { NavItem } from './types';

export const LabelWrapper = ({ label, href, onClick }: NavItem) => {
  return (
    <Flex
      alignItems={'center'}
      borderRadius="xl"
      width="full"
      _hover={{
        bg: { base: 'transparent', lg: 'hoverBackground' },
      }}
    >
      {href ? (
        <Link
          href={href}
          display="block"
          rounded="md"
          color="text"
          width="full"
          variant={'noUnderline'}
        >
          {label}
        </Link>
      ) : (
        <Box as={'button'} onClick={onClick} display="block" rounded="md" color="text" width="full">
          {label}
        </Box>
      )}
    </Flex>
  );
};
