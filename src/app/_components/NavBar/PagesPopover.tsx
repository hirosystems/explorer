import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@/components/ui/hover-card';
import { NextLink } from '@/ui/NextLink';
import { Text } from '@/ui/Text';
import { Box, Flex, Icon, Separator, Link, Stack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

const mainPages = [
  {
    id: 'blocks',
    label: 'Blocks',
    href: '/blocks',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    href: '/transactions',
  },
  {
    id: 'tokens',
    label: 'Tokens',
    href: '/tokens',
  },
  {
    id: 'signers',
    label: 'Signers',
    href: '/signers',
  },
];

const secondaryPages = [
  {
    id: 'sandbox',
    label: 'Sandbox',
    href: '/sandbox',
  },
  {
    id: 'get-help',
    label: 'Get Help',
    href: '/get-help',
  },
];

export const PagesPopover = () => {
  return (
    <HoverCardRoot openDelay={300} lazyMount positioning={{ placement: 'bottom-start', gutter: 0, offset: 0 }}>
      <HoverCardTrigger asChild>
        <Box border="1px solid white" borderRadius="xl" h="full">
          Pages
        </Box>
      </HoverCardTrigger>
      <HoverCardContent
        boxShadow={'xl'}
        bg="surface"
        rounded={'xl'}
        mt={4}
        width="fit-content"
        minWidth={200}
        maxWidth={500}
        p={2}
        borderColor="borderSecondary"
      >
        {mainPages.map(page => (
          <Flex
            className={`page-link-to-${page.id}`}
            alignItems={'center'}
            borderRadius="xl"
            width="full"
            _hover={{
              bg: { base: 'transparent', lg: 'hoverBackground' },
            }}
            p={3}
          >
            <NextLink key={page.id} href={page.href} variant="noUnderline" w="full">
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="sm">{page.label}</Text>
                <Icon
                  h={3}
                  w={3}
                  color="black"
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
            </NextLink>
          </Flex>
        ))}
        <Separator py={2} />
        <Stack gap={2} px={3} py={2}> 
          {secondaryPages.map(page => (
            <Link href={page.href} w="full">
              <Text fontSize="xs" color="textSubdued">{page.label}</Text>
            </Link>
          ))}
        </Stack>
      </HoverCardContent>
    </HoverCardRoot>
  );
};
