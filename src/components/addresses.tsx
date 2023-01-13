import { truncateMiddle } from '@/common/utils';
import { AddressLink } from '@/components/links';
import { Flex, Icon } from '@/ui/components';
import { Caption } from '@/ui/typography';
import React from 'react';
import { TbArrowRight } from 'react-icons/tb';

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
      <Icon as={TbArrowRight} size="15px" strokeWidth="1.5" color={'textCaption'} />
      <Caption display="inline-block">
        <AddressLink principal={recipient}>{truncateMiddle(recipient)}</AddressLink>
      </Caption>
    </Flex>
  )
);
