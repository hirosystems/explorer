'use client';

import { ArrowRight } from '@phosphor-icons/react';
import React from 'react';

import { AddressLink } from '../../../common/components/ExplorerLinks';
import { truncateMiddle } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Caption } from '../../../ui/typography';

interface SenderRecipientProps {
  sender: string;
  recipient: string;
}

export const SenderRecipient: React.FC<SenderRecipientProps> = React.memo(
  ({ sender, recipient }) => (
    <Flex gap={'4px'}>
      <Caption display="inline-block">
        <AddressLink principal={sender}>{truncateMiddle(sender)}</AddressLink>
      </Caption>
      <Icon as={ArrowRight} size="15px" strokeWidth="1.5" />
      <Caption display="inline-block">
        <AddressLink principal={recipient}>{truncateMiddle(recipient)}</AddressLink>
      </Caption>
    </Flex>
  )
);
