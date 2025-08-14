'use client';

import { TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { memo } from 'react';

type BlockViewType = 'bitcoin' | 'stacks';

function ViewByTabs({
  activeView,
  onViewChange,
}: {
  activeView: BlockViewType;
  onViewChange: (view: BlockViewType) => void;
}) {
  return (
    <Flex align="center" gap={3} h="full">
      <Text textStyle="text-regular-sm" color="textSecondary">
        View by:
      </Text>
      <TabsRoot
        variant="primary"
        size="redesignMd"
        value={activeView}
        onValueChange={details => onViewChange(details.value as BlockViewType)}
      >
        <TabsList>
          <TabsTrigger value="bitcoin">
            <Flex align="center" gap={1.5}>
              <Icon w={4} h={4} color={activeView === 'bitcoin' ? 'textPrimary' : 'textSecondary'}>
                <BitcoinIcon />
              </Icon>
              Bitcoin block
            </Flex>
          </TabsTrigger>
          <TabsTrigger value="stacks">
            <Flex align="center" gap={1.5}>
              <Icon w={4} h={4} color={activeView === 'stacks' ? 'textPrimary' : 'textSecondary'}>
                <StxIcon />
              </Icon>
              Stacks block
            </Flex>
          </TabsTrigger>
        </TabsList>
      </TabsRoot>
    </Flex>
  );
}

function TableControls({
  activeView,
  onViewChange,
}: {
  activeView: BlockViewType;
  onViewChange: (view: BlockViewType) => void;
}) {
  return (
    <Flex align="center">
      <ViewByTabs activeView={activeView} onViewChange={onViewChange} />
    </Flex>
  );
}

export const BlocksTableControls = memo(TableControls);
