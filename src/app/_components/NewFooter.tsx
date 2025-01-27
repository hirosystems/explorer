'use client';

import { ExplorerLink } from '@/common/components/ExplorerLinks';
import { buildUrl } from '@/common/utils/buildUrl';
import { HiroIcon } from '@/ui/icons/HiroIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Box, Flex, Grid, Icon, Stack, Text } from '@chakra-ui/react';

import { PAGE_MAX_WIDTH } from '../../common/constants/constants';
import { useGlobalContext } from '../../common/context/useGlobalContext';
import { Link } from '../../ui/Link';
import { StacksSmiley } from './Footer/StacksSmiley';

interface Link {
  label: string;
  href: string;
}

const rightSideLinks: Link[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Blocks',
    href: '/blocks',
  },
  {
    label: 'Transactions',
    href: '/transactions',
  },
  {
    label: 'sBTC',
    href: '/token/SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
  },
  {
    // This page is not implemented yet
    label: 'Stacking',
    href: '/stacking',
  },
  {
    // This page is not implemented yet
    label: 'Mempool',
    href: '/transactions',
  },
  {
    label: 'Signers',
    href: '/signers',
  },
  {
    label: 'Tokens',
    href: '/tokens',
  },
  {
    // This page is not implemented yet
    label: 'NFTs',
    href: '/nfts',
  },
  {
    // This page is not implemented yet
    label: 'Analytics',
    href: '/analytics',
  },
  {
    label: 'Search',
    href: '/search',
  },
];

const leftSideLinks: Link[] = [
  {
    label: 'Sandbox',
    href: '/sandbox/deploy',
  },
  {
    // This page is not implemented yet
    label: 'Status Center',
    href: '/status-center',
  },
  {
    label: 'Support',
    href: '/support',
  },
];

const xPadding = 8;

export const NewFooter = () => {
  const network = useGlobalContext().activeNetwork;

  return (
    <Box
      mx="auto"
      width="100%"
      maxWidth={PAGE_MAX_WIDTH}
      py={6}
      px={xPadding}
      border="1px solid"
      borderColor="borderPrimary"
      borderRadius="lg"
      position="relative"
    >
      <StacksSmiley
        h={14}
        w={14}
        position="absolute"
        bottom={0}
        right={xPadding}
        transform="translateY(50%)"
      />
      <Stack gap={8}>
        <Box hideBelow="lg">
          <Flex justifyContent="space-between">
            <Flex gap={4}>
              {rightSideLinks.map(link => (
                <ExplorerLink
                  key={link.label}
                  href={link.href}
                  fontWeight="medium"
                  fontSize="xs"
                >
                  {link.label}
                </ExplorerLink>
              ))}
            </Flex>

            <Flex gap={4}>
              {leftSideLinks.map(link => (
                <ExplorerLink
                  key={link.label}
                  href={link.href}
                  fontWeight="medium"
                  fontSize="xs"
                >
                  {link.label}
                </ExplorerLink>
              ))}
            </Flex>
          </Flex>
        </Box>
        <Box hideFrom="lg">
          <Grid templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={4}>
            {rightSideLinks.concat(leftSideLinks).map(link => (
              <ExplorerLink href={link.href} fontWeight="medium" fontSize="xs">
                {link.label}
              </ExplorerLink>
            ))}
          </Grid>
        </Box>
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={3}>
          <Flex gap={8} flexWrap="wrap" rowGap={3}>
            <Flex gap={1.5} alignItems="center" flexWrap="nowrap">
              <HiroIcon h={4} w={4} />
              <Text fontSize="xs" color="textSubdued" whiteSpace="nowrap">
                This Stacks Explorer is built and maintained by{' '}
                <Link href="https://www.hiro.so" textDecoration="underline" color="textSubdued">
                  Hiro
                </Link>
              </Text>
            </Flex>
            <Link
              href="https://www.hiro.so/p/terms-privacy"
              target="_blank"
              rel="noopener noreferrer nofollow"
              fontSize="xs"
              textDecoration="underline"
              color="textSubdued"
              whiteSpace="nowrap"
            >
              Terms of Use
            </Link>
            <Link
              href="https://www.hiro.so/p/terms-privacy"
              target="_blank"
              rel="noopener noreferrer nofollow"
              fontSize="xs"
              textDecoration="underline"
              color="textSubdued"
              whiteSpace="nowrap"
            >
              Privacy Policy
            </Link>
            <Text fontSize="xs" color="textSubdued" whiteSpace="nowrap">
              Market data provided by{' '}
              <Link
                href="https://lunarcrush.com/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                textDecoration="underline"
                color="textSubdued"
              >
                LunarCrush
              </Link>
            </Text>
          </Flex>
          <Flex gap={2} alignItems="center" position="relative" flexWrap="nowrap">
            <Icon h={4} w={4} color="text" aria-label="Stacks Logo">
              <StxIcon />
            </Icon>
            <Text fontSize="lg" fontWeight="medium">
              Stacks
            </Text>
          </Flex>
        </Flex>
      </Stack>
    </Box>
  );
};
