import {
  CopyButtonRedesign,
  DEFAULT_BUTTON_STYLING,
  DEFAULT_ICON_STYLING,
} from '@/common/components/CopyButton';
import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import { ButtonLink } from '@/ui/ButtonLink';
import { Flex } from '@chakra-ui/react';
import { Eye, Function } from '@phosphor-icons/react';

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
  if (!functionAbi) return null;

  const { name, access } = functionAbi;
  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} w="full">
      <Flex gap={2} alignItems={'center'}>
        <DefaultBadge
          label={<DefaultBadgeLabel label={name} />}
          icon={<Function />}
          variant="solid"
        />
        <CopyButtonRedesign
          initialValue={name}
          buttonProps={{
            p: 1.5,
            ...DEFAULT_BUTTON_STYLING,
          }}
          iconProps={{
            h: 3.5,
            w: 3.5,
            ...DEFAULT_ICON_STYLING,
          }}
        />
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
      </Flex>
      <ButtonLink
        href={'#'}
        onClick={() => setIsOpen(!isOpen)}
        buttonLinkSize="small"
        aria-label="Call this function"
        buttonLinkDirection={isOpen ? 'backward' : 'forward'}
      >
        {isOpen ? 'Go back' : 'Call this function'}
      </ButtonLink>
    </Flex>
  );
}
