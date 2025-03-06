'use client';

import { Flex, Icon } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import { FC, Fragment } from 'react';

import { TextLink } from '../../ui/TextLink';
import BitcoinCircleIcon from '../../ui/icons/BitcoinCircleIcon';
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
      <Circle h={4.5} w={4.5} bg="purple.600">
        <Icon h={2.5} w={2.5} color="white">
          <StxIcon />
        </Icon>
      </Circle>
      <BlockLink hash={stxBlockHash} fontWeight={'medium'} fontSize={'sm'}>
        #{stxBlockHeight}
      </BlockLink>
      {btcBlockHeight && (
        <Fragment>
          <Icon h={4} w={4} color={'slate.700'}>
            <ArrowRight />
          </Icon>
          <Icon h={4.5} w={4.5}>
            <BitcoinCircleIcon />
          </Icon>
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
