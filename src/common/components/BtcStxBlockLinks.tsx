'use client';

import { FC, Fragment } from 'react';
import { PiArrowRightLight } from 'react-icons/pi';

import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { TextLink } from '../../ui/TextLink';
import { BitcoinIcon, StxIcon } from '../../ui/icons';
import { useGlobalContext } from '../context/useAppContext';
import { Circle } from './Circle';
import { BlockLink } from './ExplorerLinks';

interface BtcStxBlockLinksProps {
  btcBlockHeight?: number;
  stxBlockHeight: number;
  stxBlockHash: string;
  fontSize?: string;
}

export const BtcStxBlockLinks: FC<BtcStxBlockLinksProps> = ({
  btcBlockHeight,
  stxBlockHeight,
  stxBlockHash,
  fontSize,
}) => {
  const { btcBlockBaseUrl } = useGlobalContext().activeNetwork;

  return (
    <Flex flexWrap={'wrap'} alignItems={'center'} gap={1.5}>
      <Circle size={'18px'} bg="purple.600">
        <Icon as={StxIcon} size={'10px'} color="white" />
      </Circle>
      <BlockLink hash={stxBlockHash} fontWeight={'medium'} fontSize={'sm'}>
        #{stxBlockHeight}
      </BlockLink>
      {btcBlockHeight && (
        <Fragment>
          <Icon as={PiArrowRightLight} size={'16px'} color={'slate.700'} />
          <Icon as={BitcoinIcon} size={'18px'} />
          <TextLink
            href={`${btcBlockBaseUrl}/${btcBlockHeight}`}
            target="_blank"
            fontSize={'sm'}
            color={'secondaryText'}
          >
            #{btcBlockHeight}
          </TextLink>
        </Fragment>
      )}
    </Flex>
  );
};
