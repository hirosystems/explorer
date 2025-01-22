import { ExplorerLink } from '@/common/components/ExplorerLinks';
import { HiroIcon } from '@/ui/icons/HiroIcon';
import { StacksNameAndLogoIcon } from '@/ui/icons/StacksNameAndLogoIcon';
import { Box, Flex, Grid, Icon, Stack, Text } from '@chakra-ui/react';

import { PAGE_MAX_WIDTH } from '../../common/constants/constants';
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
    href: '/mempool',
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
    label: 'Status Center',
    href: 'https://status.hiro.so/',
  },
  {
    label: 'Support',
    href: '/support',
  },
];

const xPadding = 8;

const TopFooterContent = () => {
  return (
    <>
      <Box hideBelow="lg" className="top-footer-content-hide-below-lg">
        <Flex justifyContent="space-between">
          <Flex gap={4}>
            {rightSideLinks.map(link => (
              <ExplorerLink key={link.label} href={link.href} fontWeight="medium" fontSize="xs">
                {link.label}
              </ExplorerLink>
            ))}
          </Flex>

          <Flex gap={4}>
            {leftSideLinks.map(link => (
              <ExplorerLink key={link.label} href={link.href} fontWeight="medium" fontSize="xs">
                {link.label}
              </ExplorerLink>
            ))}
          </Flex>
        </Flex>
      </Box>
      <Box hideFrom="lg" className="top-footer-content-hide-from-lg">
        <Grid templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={4}>
          {rightSideLinks.concat(leftSideLinks).map(link => (
            <ExplorerLink href={link.href} fontWeight="medium" fontSize="xs">
              {link.label}
            </ExplorerLink>
          ))}
        </Grid>
      </Box>
    </>
  );
};

const BottomFooterContent = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={3}>
      <BottomLinks />
      <Link href="https://stacks.co">
        <Icon h={3.5} w={18}>
          <StacksNameAndLogoIcon color="var(--stacks-colors-stacks-name-and-logo)" />
        </Icon>
      </Link>
    </Flex>
  );
};

const BottomLinks = () => {
  return (
    <Flex gap={6} flexWrap="wrap" rowGap={3}>
      <Flex gap={1.5} alignItems="center" flexWrap="nowrap">
        <HiroIcon h={4} w={4} color="var(--stacks-colors-icon-tertiary)" />
        <Text fontSize="xs" color="textSecondary" whiteSpace="nowrap">
          This Stacks Explorer is built and maintained by{' '}
          <Link
            href="https://www.hiro.so"
            textDecoration="underline"
            color="textSecondary"
            _hover={{
              color: 'textInteractiveHover',
            }}
          >
            Hiro
          </Link>
        </Text>
      </Flex>
      <Link
        href="https://www.hiro.so/terms"
        target="_blank"
        rel="noopener noreferrer nofollow"
        fontSize="xs"
        textDecoration="underline"
        color="textSecondary"
        whiteSpace="nowrap"
        _hover={{
          color: 'textInteractiveHover',
        }}
      >
        Terms of Use
      </Link>
      <Link
        href="https://www.hiro.so/privacy"
        target="_blank"
        rel="noopener noreferrer nofollow"
        fontSize="xs"
        textDecoration="underline"
        color="textSecondary"
        whiteSpace="nowrap"
        _hover={{
          color: 'textInteractiveHover',
        }}
      >
        Privacy Policy
      </Link>
      <Text fontSize="xs" color="textSecondary" whiteSpace="nowrap">
        Market data provided by{' '}
        <Link
          href="https://lunarcrush.com/"
          target="_blank"
          rel="noopener noreferrer nofollow"
          textDecoration="underline"
          color="textSecondary"
          _hover={{
            color: 'textInteractiveHover',
          }}
        >
          LunarCrush
        </Link>
      </Text>
    </Flex>
  );
};

export const NewFooter = () => {
  return (
    <Stack
      width="100%"
      maxWidth={PAGE_MAX_WIDTH}
      py={6}
      px={xPadding}
      border="1px solid"
      borderColor="newBorderSecondary"
      borderRadius="lg"
      position="relative"
      gap={0}
      justifyContent="center"
    >
      <Link href="https://stacks.co">
        <StacksSmiley
          h={14}
          w={14}
          position="absolute"
          bottom={-5}
          right={xPadding}
          transform="translateY(50%)"
          transition="bottom 0.6s ease-in-out"
          _hover={{
            bottom: -2,
          }}
        />
      </Link>
      <Stack gap={8}>
        <TopFooterContent />
        <BottomFooterContent />
      </Stack>
    </Stack>
  );
};
