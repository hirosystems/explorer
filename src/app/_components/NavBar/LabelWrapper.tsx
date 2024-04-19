import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Link } from '../../../ui/Link';
import { NavItem } from './types';
import { useIsDesktop } from './utils';

export const LabelWrapper = ({ label, href, onClick }: NavItem) => {
  const isDesktop = useIsDesktop();
  return (
    <Flex
      alignItems={'center'}
      borderRadius="xl"
      width="full"
      {...(isDesktop ? { _hover: { bg: 'dropdownBgHover' } } : {})}
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
