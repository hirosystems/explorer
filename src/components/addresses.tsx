import { IconArrowRight } from '@tabler/icons';
import React from 'react';

import { Box, Flex, Stack, StackProps, color } from '@stacks/ui';

import { truncateMiddle } from '@common/utils';

import { AddressLink } from '@components/links';
import { Caption, Link } from '@components/typography';

interface SenderRecipientProps extends StackProps {
  sender: string;
  recipient: string;
}

export const SenderRecipient: React.FC<SenderRecipientProps> = React.memo(
  ({ sender, recipient, ...rest }) => (
    <Stack isInline spacing="extra-tight" {...{ as: 'span', ...rest }}>
      <Caption display="inline-block">
        <AddressLink principal={sender}>
          <Link display="inline-block" as="a">
            {truncateMiddle(sender)}
          </Link>
        </AddressLink>
      </Caption>
      <Box
        as={IconArrowRight}
        display="inline-block"
        size="15px"
        strokeWidth="1.5"
        color={color('text-caption')}
      />
      <Caption display="inline-block">
        <AddressLink principal={recipient}>
          <Link display="inline-block" as="a">
            {truncateMiddle(recipient)}
          </Link>
        </AddressLink>
      </Caption>
    </Stack>
  )
);
