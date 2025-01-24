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

const SlidingMenu = ({ width }: { width: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const pageName = getPageNameFromPath(path);
  console.log({
    isHovered,
    height: isHovered
      ? `${contentRef?.current?.scrollHeight}px`
      : `${triggerRef?.current?.scrollHeight}px`,
  });

  return (
    <Box position="relative" h={10} minWidth={width}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          overflow: 'hidden',
          transition: 'height 1s ease',
          height:
            isHovered && contentRef?.current?.scrollHeight && triggerRef?.current?.scrollHeight
              ? `${contentRef?.current?.scrollHeight + triggerRef?.current?.scrollHeight}px`
              : `${triggerRef?.current?.scrollHeight}px`,
        }}
        position={'absolute'}
        bg="navbar.dropdownBg"
        borderRadius="xl"
      >
        <Box
          className="trigger"
          ref={triggerRef}
          boxSizing="border-box"
          h={10}
          minWidth={width}
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
        <Box
          className="content"
          ref={contentRef}
        >
          {' '}
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
      </Box>
    </Box>
  );
};

export default SlidingMenu;
