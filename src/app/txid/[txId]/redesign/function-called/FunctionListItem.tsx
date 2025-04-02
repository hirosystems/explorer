import { RowCopyButton } from '@/app/txid/[txId]/redesign/tx-summary/SummaryItem';
import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import { ButtonLink } from '@/ui/ButtonLink';
import { Flex } from '@chakra-ui/react';
import { Eye, Function, Lock } from '@phosphor-icons/react';

import { ClarityAbiFunction } from '@stacks/transactions';

export function FunctionListItem({
  functionAbi,
  isOpen,
  setIsOpen,
}: {
  functionAbi: ClarityAbiFunction;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { name, access } = functionAbi;

  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} w="full">
      <Flex gap={2} alignItems={'center'}>
        <DefaultBadge
          label={<DefaultBadgeLabel label={name} fontFamily="mono" />}
          icon={<Function weight="bold" />}
          type="tag"
          variant="solid"
        />
        <RowCopyButton value={name} ariaLabel={`copy function name`} />
        {access === 'read_only' && (
          <DefaultBadge
            px={1.5}
            py={0.5}
            bg="surfaceFifth"
            label={<DefaultBadgeLabel label={'Read Only'} fontFamily="instrument" />}
            icon={<DefaultBadgeIcon icon={<Eye weight="bold" />} color="iconSecondary" />}
            variant="solid"
          />
        )}
        {access === 'private' && (
          <DefaultBadge
            px={1.5}
            py={0.5}
            bg="surfaceFifth"
            label={<DefaultBadgeLabel label={'Private function'} fontFamily="instrument" />}
            icon={<DefaultBadgeIcon icon={<Lock weight="bold" />} color="iconSecondary" />}
            variant="solid"
          />
        )}
      </Flex>
      {access !== 'private' && (
        <ButtonLink
          buttonLinkType="button"
          onClick={() => setIsOpen(!isOpen)}
          buttonLinkSize="small"
          aria-label="Call this function"
          buttonLinkDirection={isOpen ? 'backward' : 'forward'}
        >
          {isOpen ? 'Go back' : 'Call this function'}
        </ButtonLink>
      )}
    </Flex>
  );
}
