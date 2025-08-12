'use client';

import BitcoinIcon from '@/ui/icons/BitcoinIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { memo } from 'react';

type BlockViewType = 'bitcoin' | 'stacks';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ isActive, onClick, children }: TabButtonProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      py={1}
      px={3}
      textStyle="text-medium-sm"
      color={isActive ? 'textPrimary' : 'textSecondary'}
      bg={isActive ? 'surfacePrimary' : 'transparent'}
      borderRadius={isActive ? 'redesign.md' : 'none'}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        color: 'textPrimary',
        bg: isActive ? 'surfacePrimary' : 'transparent',
      }}
    >
      {children}
    </Box>
  );
}

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
      <Flex gap={3} h={7}>
        <TabButton isActive={activeView === 'bitcoin'} onClick={() => onViewChange('bitcoin')}>
          <Flex align="center" gap={1.5}>
            <Icon w={4} h={4} color={activeView === 'bitcoin' ? 'textPrimary' : 'textSecondary'}>
              <BitcoinIcon />
            </Icon>
            Bitcoin block
          </Flex>
        </TabButton>
        <TabButton isActive={activeView === 'stacks'} onClick={() => onViewChange('stacks')}>
          <Flex align="center" gap={1.5}>
            <Icon w={4} h={4} color={activeView === 'stacks' ? 'textPrimary' : 'textSecondary'}>
              <StxIcon />
            </Icon>
            Stacks block
          </Flex>
        </TabButton>
      </Flex>
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
