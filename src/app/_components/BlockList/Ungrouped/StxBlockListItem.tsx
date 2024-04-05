import { ReactNode } from 'react';

import { Circle } from '../../../../common/components/Circle';
import { BlockLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Text } from '../../../../ui/Text';

interface StxBlockListItemLayoutProps {
  children: ReactNode;
  hasIcon: boolean;
  hasBorder: boolean;
}

export function StxBlockListItemLayout({
  children,
  hasIcon,
  hasBorder,
}: StxBlockListItemLayoutProps) {
  return (
    <Box
      pl={4}
      borderLeft={hasIcon ? undefined : '1px'}
      borderColor="borderPrimary"
      position="relative"
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        flexGrow={1}
        height={14}
        borderBottom={hasBorder ? '1px' : 'none'}
        _after={
          hasIcon
            ? {
                // adds a little but of a line to the left of the first block with an icon
                content: '""',
                position: 'absolute',
                left: '0',
                bottom: '0',
                height: '10px',
                width: '1px',
                backgroundColor: 'borderPrimary',
              }
            : {
                // node
                content: '""',
                position: 'absolute',
                left: '-3px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                backgroundColor: 'borderPrimary',
                borderRadius: '50%',
              }
        }
      >
        {children}
      </Flex>
    </Box>
  );
}

function StxBlockListItemContent({
  height,
  hash,
  timestamp,
  txsCount,
  icon,
}: {
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
  icon?: ReactNode;
}) {
  return (
    <>
      <Flex>
        {!!icon && (
          <Circle size={4.5} bg="brand" ml={-6} mr={2} border={'none'}>
            {icon}
          </Circle>
        )}

        <BlockLink hash={hash}>
          <Text fontSize="sm" color="text" fontWeight="medium">
            #{height}
          </Text>
        </BlockLink>
      </Flex>
      <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'12px'} color="textSubdued">
        <Box>{truncateMiddle(hash, 3)}</Box>
        {txsCount !== undefined ? <Box>{txsCount} txn</Box> : null}
        <Timestamp ts={timestamp} />
      </HStack>
    </>
  );
}

interface StxBlockListItemProps {
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
  icon?: ReactNode;
  hasBorder: boolean;
}

export function StxBlockListItem({
  height,
  hash,
  timestamp,
  txsCount,
  icon,
  hasBorder,
}: StxBlockListItemProps) {
  return (
    <StxBlockListItemLayout hasIcon={!!icon} hasBorder={hasBorder}>
      <StxBlockListItemContent
        height={height}
        hash={hash}
        timestamp={timestamp}
        txsCount={txsCount}
        icon={icon}
      />
    </StxBlockListItemLayout>
  );
}
