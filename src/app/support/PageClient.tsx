'use client';

import { Stack } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { ReactNode } from 'react';

import { Card } from '../../common/components/Card';
import { ListItem } from '../../ui/ListItem';
import { Text } from '../../ui/Text';
import { TextLink } from '../../ui/TextLink';
import { UnorderedList } from '../../ui/UnorderedList';
import { PageTitle } from '../_components/PageTitle';

function ExternalLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <TextLink href={href} target={'_blank'} color={'purple.600'} textDecoration={'underline'}>
      {children}
    </TextLink>
  );
}

const SupportPage: NextPage = () => {
  return (
    <>
      <PageTitle>Need support? </PageTitle>
      <Stack gap={4}>
        <Card lineHeight={'tall'} p={8} pb={10}>
          <Stack gap={4}>
            <Text fontSize={'xl'} fontWeight={'medium'}>
              Transaction help
            </Text>
            <Text fontSize={'sm'}>
              Do you have questions about a pending transaction, incorrect nonces, or missing memos?
            </Text>
            <UnorderedList display={'flex'} flexDirection={'column'} gap={4} pl={2}>
              <ListItem>
                <Text fontSize={'sm'}>
                  For users, two of the most popular Stacks wallets provide help centers, which can
                  help you find answers to common questions around transactions. You can find the{' '}
                  <ExternalLink href={'https://leather.io/guides'}>Leather guides</ExternalLink>{' '}
                  here and the{' '}
                  <ExternalLink href={'https://support.xverse.app/hc/en-us'}>
                    Xverse support center here
                  </ExternalLink>
                  .
                </Text>
              </ListItem>
              <ListItem>
                <Text fontSize={'sm'}>
                  For developers, you can learn more about transactions in Stacks documentation.
                </Text>
              </ListItem>
            </UnorderedList>
            <Text fontSize={'sm'}>
              If you need further assistance, you can reach out to the Stacks community, and you can
              get help in the #support channel on the Stacks Discord.
            </Text>
          </Stack>
        </Card>
        <Card lineHeight={'tall'} p={8} pb={10}>
          <Stack gap={4}>
            <Text fontSize={'xl'} fontWeight={'medium'}>
              Accessing your wallet and assets
            </Text>
            <Text fontSize={'sm'}>
              If you are having trouble accessing your wallet or assets in it, please reach out to
              your wallet provider directly.{' '}
              <ExternalLink
                href={'https://www.stacks.co/explore/ecosystem?category=All+Teams#wallets'}
              >
                A list of Stacks wallets can be found here
              </ExternalLink>
              .
            </Text>
          </Stack>
        </Card>
        <Card lineHeight={'tall'} p={8} pb={10}>
          <Stack gap={4}>
            <Text fontSize={'xl'} fontWeight={'medium'}>
              General questions about Stacks
            </Text>
            <Text fontSize={'sm'}>
              Check out the{' '}
              <ExternalLink href={'https://www.stacks.co/'}>Stacks website</ExternalLink>, which has
              an{' '}
              <ExternalLink href={'https://www.stacks.co/learn/introduction'}>
                overview of Stacks
              </ExternalLink>
              , a <ExternalLink href={'https://www.stacks.co/learn/faq'}>helpful FAQ</ExternalLink>,
              and more.
            </Text>
            <Text fontSize={'sm'}>
              You can also get involved with the community and join{' '}
              <ExternalLink href={'https://stacks.chat'}>the Stacks Discord</ExternalLink>.
            </Text>
          </Stack>
        </Card>
        <Card lineHeight={'tall'} p={8} pb={10}>
          <Stack gap={4}>
            <Text fontSize={'xl'} fontWeight={'medium'}>
              Submit a bug or product feedback
            </Text>
            <Text fontSize={'sm'}>
              We’d love to hear from you.{' '}
              <ExternalLink href={'https://github.com/hirosystems/explorer/issues/new/choose'}>
                Open a GitHub issue
              </ExternalLink>
              .
            </Text>
          </Stack>
        </Card>
        <Card lineHeight={'tall'} p={8} pb={10}>
          <Stack gap={4}>
            <Text fontSize={'xl'} fontWeight={'medium'}>
              Found a bug in the Stacks blockchain?
            </Text>
            <Text fontSize={'sm'}>
              <ExternalLink href={'https://immunefi.com/bounty/stacks/'}>
                Participate in the Stacks bounty program
              </ExternalLink>{' '}
              with ImmuneFi and receive bounties ranging from $1,000 to $1,000,000 depending on how
              critical the bug is.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </>
  );
};

export default SupportPage;
