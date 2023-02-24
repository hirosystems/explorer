import { useGlobalContext } from '@/common/context/useAppContext';
import { NetworkModes } from '@/common/types/network';
import { Circle } from '@/components/circle';
import { BlockLink } from '@/components/links';
import { Box, Icon, TextLink } from '@/ui/components';
import { BitcoinIcon } from '@/ui/icons';
import { StxIcon } from '@/ui/icons/StxIcon';
import { Text } from '@/ui/typography';
import { useColorMode } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { FC, Fragment } from 'react';
import { HiOutlineArrowSmRight } from 'react-icons/hi';

interface BtcStxBlockLinksProps {
  btcBlockHeight?: number;
  stxBlockHeight: number;
  stxBlockHash: string;
  fontSize?: string;
}

const wrapperStyle = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const iconStyle = css`
  position: relative;
  margin-right: 3px;
  border-radius: 18px;
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const linkStyle = (secondary?: boolean, clickable?: boolean, fontSize?: string) => css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  text-decoration: none;
  ${fontSize ? `font-size: ${fontSize};` : 'font-size: 14px;'}
  ${clickable &&
  `
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  `}
  ${secondary &&
  `
    color: #747478;
    font-size: 12px;
  `}
`;

export const BtcStxBlockLinks: FC<BtcStxBlockLinksProps> = ({
  btcBlockHeight,
  stxBlockHeight,
  stxBlockHash,
  fontSize,
}) => {
  const activeNetworkMode = useGlobalContext().activeNetwork.mode;
  const btcLinkPathPrefix = activeNetworkMode === NetworkModes.Testnet ? '/testnet' : '';

  return (
    <Box css={wrapperStyle}>
      <Circle size={18} backgroundColor={`accent.light`} css={iconStyle}>
        <StxIcon strokeWidth={2} size="11px" color="white" />
      </Circle>
      <BlockLink hash={stxBlockHash}>
        <Text
          fontWeight={500}
          fontSize={'15px'}
          as={'a'}
          color={`links.${useColorMode().colorMode}`}
          _hover={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          #{stxBlockHeight}
        </Text>
      </BlockLink>
      {btcBlockHeight && (
        <Fragment>
          <Icon as={HiOutlineArrowSmRight} size="14px" color={'#747478'} m={'0 2px'} />
          <Icon as={BitcoinIcon} color={'#f7931a'} size={19} css={iconStyle} />
          <TextLink
            css={linkStyle(true, true, fontSize)}
            href={`https://mempool.space${btcLinkPathPrefix}/block/${btcBlockHeight}`}
            target="_blank"
          >
            #{btcBlockHeight}
          </TextLink>
        </Fragment>
      )}
    </Box>
  );
};
