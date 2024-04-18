import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Link } from '../../../ui/Link';
import { NavItem } from './types';

export const DesktopSubNav = ({ label, href, onClick }: NavItem) => {
  return (
    <Flex
      alignItems={'center'}
      borderRadius="xl"
      _hover={{
        bg: 'dropdownBgHover',
      }}
      width="full"
    >
      {href ? (
        <Link
          href={href}
          display="block"
          rounded="md"
          color="text"
          width="fit-content"
          variant="noUnderline"
        >
          {label}
        </Link>
      ) : (
        <Box
          as={'button'}
          onClick={onClick}
          role="group"
          display="block"
          rounded="md"
          color="text"
          width="full"
          textAlign={'left'}
        >
          {label}
        </Box>
      )}
    </Flex>
  );
};
