'use client';

import { ArrowRight } from '@phosphor-icons/react';
import { FC, Fragment } from 'react';

import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { TextLink } from '../../ui/TextLink';
import BitcoinIcon from '../../ui/icons/BitcoinIcon';
import StxIcon from '../../ui/icons/StxIcon';
import { useGlobalContext } from '../context/useGlobalContext';
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
        <Icon as={StxIcon} size={2.5} color="white" />
      </Circle>
      <BlockLink hash={stxBlockHash} fontWeight={'medium'} fontSize={'sm'}>
        #{stxBlockHeight}
      </BlockLink>
      {btcBlockHeight && (
        <Fragment>
          <Icon as={ArrowRight} size={4} color={'slate.700'} />
          <Icon as={BitcoinIcon} size={4.5} />
          <TextLink
            href={`${btcBlockBaseUrl}/${btcBlockHeight}`}
            target="_blank"
            fontSize={'sm'}
            color={'textSubdued'}
          >
            #{btcBlockHeight}
          </TextLink>
        </Fragment>
      )}
    </Flex>
  );
};
