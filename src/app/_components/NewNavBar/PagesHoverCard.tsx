import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@/components/ui/hover-card';
import { NextLink } from '@/ui/NextLink';
import { Text } from '@/ui/Text';
import { Box, Flex, Icon, Link, Separator, Stack } from '@chakra-ui/react';
import { ArrowRight, CaretUpDown, List } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

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

const getPageNameFromPath = (path: string) => {
  if (path === '/transactions') return 'Transactions';
  if (path === '/tokens') return 'Tokens';
  if (path === '/signers') return 'Signers';
  if (path === '/blocks') return 'Blocks';
  if (path === '/sandbox') return 'Sandbox';
  if (path === '/get-help') return 'Get Help';
  if (path === '/') return 'Home';
  return 'Menu';
};

export const PagesHoverCard = () => {
  const path = usePathname();
  const pageName = getPageNameFromPath(path);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  console.log('PagesHoverCard', { contentHeight: contentRef?.current?.scrollHeight });

  return (
    <HoverCardRoot
      openDelay={300}
      positioning={{
        placement: 'bottom-start',
        gutter: 0,
        offset: { mainAxis: 0, crossAxis: 0 },
        shift: 0,
        slide: true,
        sameWidth: true,
      }}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <HoverCardTrigger asChild>
        <Box
          border="1px solid white"
          borderTopRadius="xl"
          borderBottomRadius={isOpen ? 'none' : 'xl'}
          h={10}
          minWidth={50}
          alignItems="center"
          py={2}
          px={3}
        >
          <Flex gap={6} alignItems="center" justifyContent="space-between">
            <Flex gap={2}>
              <Flex
                h={6}
                w={8}
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderRadius="xl"
                borderColor="borderSubdued"
              >
                <Icon h={4} w={4}>
                  <List />
                </Icon>
              </Flex>
              <Text fontSize="sm">{pageName}</Text>
            </Flex>
            <Icon h={3} w={3}>
              <CaretUpDown />
            </Icon>
          </Flex>
        </Box>
      </HoverCardTrigger>
      <HoverCardContent
        bg="surface"
        borderTopRadius={'none'}
        borderBottomRadius={'xl'}
        minWidth={200}
        maxWidth={500}
        p={2}
        borderColor="borderSecondary"
        ref={contentRef}
      >
        <Box
          // height={`${contentRef?.current?.scrollHeight}px`}
          // overflow="hidden"
          transition="height 1s ease"
          
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
                <Text fontSize="xs" color="textSubdued">
                  {page.label}
                </Text>
              </Link>
            ))}
          </Stack>
        </Box>
      </HoverCardContent>
    </HoverCardRoot>
  );
};
