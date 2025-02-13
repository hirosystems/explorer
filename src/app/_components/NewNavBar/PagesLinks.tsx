import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { Link } from '@/ui/Link';
import { NextLink } from '@/ui/NextLink';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

import { PrimaryPage, SecondaryPage } from './consts';

export const PrimaryPageLink = ({ page, onClick }: { page: PrimaryPage; onClick?: () => void }) => {
  const network = useGlobalContext().activeNetwork;

  return (
    <NextLink href={buildUrl(page.href, network)} variant="noUnderline" w="full" onClick={onClick}>
      <Flex
        className={`page-link-to-${page.id}`}
        alignItems={'center'}
        borderRadius="redesign.md"
        width="full"
        _hover={{
          bg: { base: { base: 'surfacePrimary', _dark: 'surfaceFourth' }, lg: 'surfaceTertiary' },
        }}
        p={3}
      >
        <Flex justifyContent="space-between" alignItems="center" width="full">
          <Text fontSize={{ base: 'lg', lg: 'sm' }}>{page.label}</Text>
          <Icon
            h={{ base: 4, lg: 3 }}
            w={{ base: 4, lg: 3 }}
            color="iconPrimary"
            opacity={0}
            css={{
              [`.page-link-to-${page.id}:hover &`]: {
                opacity: 1,
              },
            }}
          >
            <ArrowRight />
          </Icon>
        </Flex>
      </Flex>
    </NextLink>
  );
};

export const SecondaryPageLink = ({
  page,
  onClick,
}: {
  page: SecondaryPage;
  onClick?: () => void;
}) => {
  return (
    <Flex justifyContent="space-between">
      <Link href={page.href} variant="noUnderline" onClick={onClick}>
        <Text
          fontSize={{ base: 'md', lg: 'xs' }}
          color="textSecondary"
          fontWeight="medium"
          _hover={{
            color: 'textPrimary',
          }}
        >
          {page.label}
        </Text>
      </Link>
    </Flex>
  );
};
