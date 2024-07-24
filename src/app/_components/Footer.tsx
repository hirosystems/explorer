'use client';

import { usePathname } from 'next/navigation';
import { FC } from 'react';

import { PAGE_MAX_WIDTH } from '../../common/constants/constants';
import { RELEASE_TAG_NAME } from '../../common/constants/env';
import { useGlobalContext } from '../../common/context/useGlobalContext';
import { buildUrl } from '../../common/utils/buildUrl';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Link, LinkProps } from '../../ui/Link';
import { useColorMode } from '../../ui/hooks/useColorMode';

const FooterLink: FC<LinkProps> = ({ children, href, target, rel }) => {
  return (
    <Link href={href} fontSize={'xs'} target={target} rel={rel}>
      {children}
    </Link>
  );
};

export const Footer: FC = () => {
  const network = useGlobalContext().activeNetwork;
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const colorMode = useColorMode().colorMode;

  return (
    <Box
      mx="auto"
      width="100%"
      maxWidth={PAGE_MAX_WIDTH}
      mt={'auto'}
      mb={['16px', '16px', '32px']}
      px={['16px', '16px', '32px']}
    >
      <Flex direction={'column'} suppressHydrationWarning={true}>
        {isHomePage && colorMode === 'light' && (
          <div
            id={'lightbox-inline-form-50d327d3-62d7-4896-a6d3-1363b5923751'}
            style={{ textAlign: 'center', backgroundColor: 'transparent' }}
          ></div>
        )}
        <Flex
          flexDirection={['column', 'column', 'row']}
          alignItems={['center', 'center', 'unset']}
          textAlign={['center', 'center', 'unset']}
          px={'unset'}
        >
          <Flex display="flex" flexDirection={'column'} gap="5px">
            <Flex pb={['8px', '8px', 'unset']} pr={['unset', 'unset', '16px']} gap={'16px'}>
              <FooterLink href={buildUrl('/transactions', network)}>Recent transactions</FooterLink>
              {!network.isSubnet && (
                <FooterLink href={buildUrl('/sandbox/deploy', network)}>Sandbox</FooterLink>
              )}
              <FooterLink
                href="https://immunefi.com/bounty/stacks/"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Found a bug in the Stacks Blockchain?
              </FooterLink>
            </Flex>
            <Box>
              <FooterLink
                href="https://lunarcrush.com/"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Market data provided by LunarCrush
              </FooterLink>
            </Box>
          </Flex>

          <Flex display="flex" marginLeft={'auto'} flexDirection={'column'} gap="5px">
            <Flex ml={['unset', 'unset', 'auto']} gap={'16px'}>
              <FooterLink href="/support">Support</FooterLink>
              <FooterLink
                href="https://github.com/hirosystems/explorer/issues/new/choose"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Submit bug or feature request
              </FooterLink>
              <FooterLink
                href="https://www.hiro.so/p/terms-privacy"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Terms & Privacy
              </FooterLink>
            </Flex>
            {RELEASE_TAG_NAME && (
              <Box marginLeft={'auto'}>
                <FooterLink
                  href={`https://github.com/hirosystems/explorer/releases/tag/${RELEASE_TAG_NAME}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Version {RELEASE_TAG_NAME}
                </FooterLink>
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
