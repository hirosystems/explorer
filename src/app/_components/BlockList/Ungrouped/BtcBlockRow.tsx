import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BsArrowReturnLeft } from 'react-icons/bs';

import { ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { BitcoinIcon } from '../../../../ui/icons';

interface BtcBlockRowProps {
  height: number | string;
  hash: string;
  timestamp?: number;
}
export function BtcBlockRowLayout({ children, ...rest }: FlexProps & { children: ReactNode }) {
  const textColor = useColorModeValue('slate.700', 'slate.500'); // TODO: not in theme. remove
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      px={6}
      mx={-6}
      height={14}
      backgroundColor="surfaceHighlight"
      color={textColor}
      {...rest}
    >
      {children}
    </Flex>
  );
}

export function BtcBlockRowContent({ timestamp, height, hash }: BtcBlockRowProps) {
  const iconColor = useColorModeValue('slate.600', 'slate.800'); // TODO: not in theme. remove
  return (
    <>
      <HStack gap={1.5}>
        <Icon
          as={BsArrowReturnLeft}
          transform={'rotate(90deg)'}
          size={2.5}
          color={iconColor}
          position={'relative'}
          bottom={'1px'}
        />
        <Icon as={BitcoinIcon} size={18} position={'relative'} bottom={'1px'} />
        <ExplorerLink fontSize="sm" color={'textSubdued'} href={`/btcblock/${hash}`}>
          #{height}
        </ExplorerLink>
      </HStack>
      <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'xs'}>
        <Box>{truncateMiddle(hash, 3)}</Box>
        {timestamp && <Timestamp ts={timestamp} />}
      </HStack>
    </>
  );
}

export function BtcBlockRow({ timestamp, height, hash }: BtcBlockRowProps) {
  return (
    <BtcBlockRowLayout>
      <BtcBlockRowContent timestamp={timestamp} height={height} hash={hash} />
    </BtcBlockRowLayout>
  );
}
