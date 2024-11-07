'use client';

import { Icon } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import React from 'react';

import { AddressLink } from '../../../common/components/ExplorerLinks';
import { truncateMiddle } from '../../../common/utils/utils';
import { Caption } from '../../../ui/typography';

interface SenderRecipientProps {
  sender: string;
  recipient: string;
}

export const SenderRecipient: React.FC<SenderRecipientProps> = React.memo(
  ({ sender, recipient }) => (
    <Flex gap={1}>
      <Caption display="inline-block">
        <AddressLink principal={sender}>{truncateMiddle(sender)}</AddressLink>
      </Caption>
      <Icon h={4} w={4} strokeWidth="1.5">
        <ArrowRight />
      </Icon>
      <Caption display="inline-block">
        <AddressLink principal={recipient}>{truncateMiddle(recipient)}</AddressLink>
      </Caption>
    </Flex>
  )
);
