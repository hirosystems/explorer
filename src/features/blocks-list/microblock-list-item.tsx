import React from 'react';
import pluralize from 'pluralize';
import { useHoverableState } from '@components/hoverable';
import { color, Flex, Stack } from '@stacks/ui';
import { ItemIcon } from '@components/item-icon';
import { Caption, Text, Title } from '@components/typography';
import { addSepBetweenStrings, toRelativeTime, truncateMiddle } from '@common/utils';
import { MicroblockLink } from '@components/links';
import { useMicroblock } from './hooks';

export const MicroblockItem: React.FC<{
  blockTime: number;
  hash: string;
  index: number;
  length: number;
}> = ({ blockTime, hash, index, length, ...rest }) => {
  const isHovered = useHoverableState();
  const [microblock] = useMicroblock(hash);

  return microblock ? (
    <MicroblockLink hash={microblock.microblock_hash} {...rest}>
      <Flex
        justifyContent="space-between"
        py="loose"
        color={color('text-body')}
        _hover={{
          borderLeftColor: color('accent'),
        }}
        as="a"
        {...rest}
      >
        <Stack as="span" isInline alignItems="center" spacing="base">
          <ItemIcon size="40px" type="microblock" />
          <Stack spacing="tight" as="span">
            <Flex color={color(isHovered ? 'brand' : 'text-title')} alignItems="center">
              <Title display="block" color="currentColor">
                {truncateMiddle(microblock.microblock_hash)}
              </Title>
            </Flex>
            <Caption display="block">
              {'Microblock' +
                ' · ' +
                addSepBetweenStrings([
                  `${microblock.txs.length} ${pluralize('transactions', microblock.txs.length)}`,
                ])}
            </Caption>
          </Stack>
        </Stack>
        <Stack spacing="tight" textAlign="right" as="span">
          <Text
            fontSize="14px"
            width="100%"
            textAlign="right"
            color={color('text-body')}
            display="block"
          >
            {toRelativeTime(blockTime * 1000)}
          </Text>
        </Stack>
      </Flex>
    </MicroblockLink>
  ) : null;
};
