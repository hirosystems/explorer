import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { NextLink } from '@/ui/NextLink';
import { Text } from '@/ui/Text';
import { Box, Flex, Icon, Link, Separator, Stack } from '@chakra-ui/react';
import { ArrowRight, CaretUpDown, List } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
    id: 'mempool',
    label: 'Mempool',
    href: '/mempool',
  },
  {
    id: 'stacking',
    label: 'Stacking',
    href: '/stacking',
  },
  {
    id: 'signers',
    label: 'Signers',
    href: '/signers',
  },
  {
    id: 'tokens',
    label: 'Tokens',
    href: '/tokens',
  },
  {
    id: 'nfts',
    label: 'NFTs',
    href: '/nfts',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
  },
];

const secondaryPages = [
  {
    id: 'sandbox',
    label: 'Sandbox',
    href: '/sandbox',
    shortcut: 'S',
  },
  {
    id: 'status-center',
    label: 'Status Center',
    href: '/status-center',
  },
  {
    id: 'support',
    label: 'Support',
    href: '/support',
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
  const network = useGlobalContext().activeNetwork;
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the menu is open
      if (isHovered) {
        // Check if the 'S' key is pressed
        if (event.key.toLowerCase() === 's') {
          event.preventDefault(); // Prevent default behavior if necessary
          router.push('/sandbox/deploy');
        }
      }
    };

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHovered, router]);

  return (
    <Box position="relative" h={10} minWidth={width}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          overflow: 'hidden',
          transition: 'height 0.5s ease',
          height:
            isHovered && contentRef?.current?.scrollHeight && triggerRef?.current?.scrollHeight
              ? `${contentRef?.current?.scrollHeight + triggerRef?.current?.scrollHeight}px`
              : `${triggerRef?.current?.scrollHeight}px`,
        }}
        position={'absolute'}
        zIndex="dropdown"
        bg="navbar.menu.bg"
        borderRadius="xl"
      >
        <Box
          className="trigger"
          ref={triggerRef}
          boxSizing="border-box"
          h={10}
          minWidth={width}
          alignItems="center"
          p={2}
        >
          <Flex gap={6} alignItems="center" justifyContent="space-between">
            <Flex gap={2}>
              <Flex
                h={6}
                w={8}
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                bg={isHovered ? 'navbar.listIconHoverBg' : 'transparent'}
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
        <Box className="content" ref={contentRef} px={2} pb={2}>
          {mainPages.map(page => (
            <Flex
              className={`page-link-to-${page.id}`}
              alignItems={'center'}
              borderRadius="xl"
              width="full"
              _hover={{
                bg: 'navbar.menu.menuItem.bg',
              }}
              p={3}
            >
              <NextLink
                key={page.id}
                href={buildUrl(page.href, network)}
                variant="noUnderline"
                w="full"
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm">{page.label}</Text>
                  <Icon
                    h={3}
                    w={3}
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
              </NextLink>
            </Flex>
          ))}
          <Separator py={2} color="newBorderSecondary" />
          <Stack gap={2} px={3} py={2}>
            {secondaryPages.map(page => (
              <Flex justifyContent="space-between">
                <Link href={page.href} w="full" variant="noUnderline">
                  <Text
                    fontSize="xs"
                    color="textSubdued"
                    fontWeight="medium"
                    _hover={{
                      color: 'text',
                    }}
                  >
                    {page.label}
                  </Text>
                </Link>
                {page.shortcut && (
                  <Box px={2} py={1} bg="navbar.menu.menuItem.bg" borderRadius="lg">
                    <Text fontSize="xs" color="textSubdued" fontWeight="medium">
                      {page.shortcut}
                    </Text>
                  </Box>
                )}
              </Flex>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default SlidingMenu;
