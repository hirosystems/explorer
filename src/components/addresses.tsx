import React from 'react';
import { Stack, color, Flex, Box, StackProps } from '@stacks/ui';
import { IconArrowRight } from '@tabler/icons';
import { Caption, Link } from '@components/typography';
import { AddressLink } from '@components/links';
import { truncateMiddle } from '@common/utils';

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
      <Box display="inline-block" as="span" width="15px" color={color('text-caption')}>
        <IconArrowRight strokeWidth="1.5" size="15px" />
      </Box>
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
