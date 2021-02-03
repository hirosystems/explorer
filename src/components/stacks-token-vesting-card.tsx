import * as React from 'react';

import { Box, color } from '@stacks/ui';
import { Text } from '@components/typography';
import { Section } from '@components/section';
import { Link } from './link';

export const StacksTokenVestingCard: React.FC = () => {
  return (
    <Section mt="extra-loose" title="Stacks Token unlocking">
      <Box p="base-loose">
        <Text color={color('text-body')} fontSize={1} lineHeight="24px">
          The Stacks explorer is currently unable to display specific details around this address's
          unlocking schedule.
        </Text>
        <Text color={color('text-body')} fontSize={1} lineHeight="24px" mt="base">
          The balance shown here does not reflect any locked STX that may be associated safely with
          this address as well.
        </Text>
        <Link
          fontSize={1}
          color={color('brand')}
          textDecoration="none"
          mt="base"
          href="https://forum.stacks.org/t/stacks-explorer-and-token-unlockings-from-2019-offering/11682"
          target="_blank"
          rel="noreferrer noopener"
          _hover={{
            textDecoration: 'underline',
          }}
        >
          Learn more
        </Link>
      </Box>
    </Section>
  );
};
