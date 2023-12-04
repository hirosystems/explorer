import { Button, ButtonProps } from '@/ui/Button';
import { Flex } from '@/ui/Flex';
import { FormControl } from '@/ui/FormControl';
import { FormLabel } from '@/ui/FormLabel';
import { Icon } from '@/ui/Icon';
import { Stack } from '@/ui/Stack';
import { Switch, SwitchProps } from '@/ui/Switch';
import { Text } from '@/ui/Text';
import { TextLink } from '@/ui/TextLink';
import { Tooltip } from '@/ui/Tooltip';
import { useColorMode } from '@/ui/hooks/useColorMode';
import { keyframes } from '@emotion/react';
import React from 'react';
import CountUp from 'react-countup';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineHashtag } from 'react-icons/hi';
import { TfiReload } from 'react-icons/tfi';

import usePrevious from '../../../common/hooks/usePrevious';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface ControlsProps {
  groupByBtc: SwitchProps;
  liveUpdates: SwitchProps;
  heightView: ButtonProps;
  blockView: ButtonProps;
  update: {
    isLoading: boolean;
    onClick: () => void;
  };
  latestBlocksCount: number;
}

export function Controls({
  groupByBtc,
  liveUpdates,
  heightView,
  blockView,
  update,
  latestBlocksCount,
}: ControlsProps) {
  const colorMode = useColorMode().colorMode;
  const previousBlocksCount = usePrevious(latestBlocksCount);
  console.log('latestBlocksCount', latestBlocksCount);
  console.log('previousBlocksCount', previousBlocksCount);
  return (
    <Stack spacing={'6px'}>
      <Flex justifyContent={'space-between'}>
        <FormControl display="flex" alignItems="center" gap={'12px'} minW={0}>
          <Switch id="group-by-btc" {...groupByBtc} />
          <FormLabel
            htmlFor="group-by-btc"
            mb="0"
            fontSize={'14px'}
            lineHeight={'1.5em'}
            fontWeight={400}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
          >
            Group by Bitcoin block
          </FormLabel>
        </FormControl>
        <Flex gap={'5px'}>
          <Tooltip label={'Height view'}>
            <Button
              backgroundColor={'#DCDDE2'}
              minW={0}
              h={'auto'}
              padding={'8px'}
              border={'1px solid #DCDDE2'}
              _hover={{ backgroundColor: '#DCDDE2' }}
              _disabled={{ backgroundColor: '#fff' }}
              {...heightView}
            >
              <Icon as={HiOutlineHashtag} width={'16px'} height={'16px'} />
            </Button>
          </Tooltip>
          <Tooltip label={'Block view'}>
            <Button
              minW={0}
              h={'auto'}
              padding={'8px'}
              border={'1px solid #DCDDE2'}
              _hover={{ backgroundColor: '#DCDDE2' }}
              _disabled={{ backgroundColor: '#fff' }}
              {...blockView}
            >
              <Icon as={BsGrid} width={'16px'} height={'16px'} />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      <FormControl display="flex" alignItems="center" gap={'12px'}>
        <Switch id="live-updates" {...liveUpdates} />
        <FormLabel
          htmlFor="live-updates"
          mb="0"
          fontSize={'14px'}
          lineHeight={'1.5em'}
          fontWeight={400}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
        >
          Live updates
        </FormLabel>
      </FormControl>
      <Flex
        justifyContent={'space-between'}
        backgroundColor={'#F5F5F7'}
        margin={'4.5px -35px 6px -35px'}
        padding={'8px 36px'}
        gap={'5px'}
      >
        <Text
          fontSize={'14px'}
          color={'#777'}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
        >
          <Text display={'inline'} fontWeight={700}>
            <CountUp start={previousBlocksCount} end={latestBlocksCount} duration={1.25} delay={0}>
              {({ countUpRef, start }) => <span ref={countUpRef} />}
            </CountUp>
          </Text>{' '}
          new Stacks blocks have come in
        </Text>
        <TextLink
          href={'javascript:void(0)'}
          color={`brand.${colorMode}`}
          _hover={{ textDecoration: 'underline' }}
          onClick={update.onClick}
        >
          <Flex alignItems={'center'} gap={'6px'}>
            <Icon
              as={TfiReload}
              w={'12px'}
              h={'12px'}
              transform={'rotate(90deg) scaleX(-1)'}
              css={{
                animation: `${spin} 0.5s linear infinite`,
                animationPlayState: update.isLoading ? 'running' : 'paused',
              }}
            />
            <Text fontSize={'14px'}>Update</Text>
          </Flex>
        </TextLink>
      </Flex>
    </Stack>
  );
}
