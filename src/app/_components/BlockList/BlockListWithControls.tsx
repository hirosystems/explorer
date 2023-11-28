'use client';

import { useColorMode } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import React, { useEffect } from 'react';
import CountUp from 'react-countup';
import { BsGrid } from 'react-icons/bs';
import { HiOutlineHashtag } from 'react-icons/hi';
import { HiMiniArrowUpRight } from 'react-icons/hi2';
import { TfiReload } from 'react-icons/tfi';

import { SectionWithControls } from '../../../common/components/Section';
import { Button } from '../../../ui/Button';
import { Flex } from '../../../ui/Flex';
import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { Switch } from '../../../ui/Switch';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import { Tooltip } from '../../../ui/Tooltip';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export function BlockListWithControls() {
  const colorMode = useColorMode().colorMode;
  const [loading, setLoading] = React.useState(false);
  const [oldBlocksCount, setOldBlocksCount] = React.useState(0);
  const [newBlocksCount, setNewBlocksCount] = React.useState(16);
  const [groupedByBtc, setGroupedByBtc] = React.useState(true);
  const [liveUpdates, setLiveUpdates] = React.useState(false);
  const [heightView, setHeightView] = React.useState(false);
  const [blockView, setBlockView] = React.useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOldBlocksCount(newBlocksCount);
      setNewBlocksCount(newBlocksCount + Math.floor(Math.random() * 50) + 3);
    }, 5000);

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [newBlocksCount]);
  return (
    <SectionWithControls
      title="Recent Blocks"
      controls={
        <Stack spacing={'6px'}>
          <Flex justifyContent={'space-between'}>
            <FormControl display="flex" alignItems="center" gap={'12px'} minW={0}>
              <Switch
                id="group-by-btc"
                onChange={() => {
                  setGroupedByBtc(!groupedByBtc);
                }}
                isChecked={groupedByBtc}
              />
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
                  color={heightView ? '#242629' : '#8D929A'}
                  minW={0}
                  h={'auto'}
                  padding={'8px'}
                  border={'1px solid #DCDDE2'}
                  _hover={{ backgroundColor: '#DCDDE2' }}
                  _disabled={{ backgroundColor: '#fff' }}
                  isDisabled={heightView}
                  onClick={() => {
                    setHeightView(true);
                    setBlockView(false);
                  }}
                  cursor={heightView ? 'default' : 'pointer'}
                >
                  <Icon as={HiOutlineHashtag} width={'16px'} height={'16px'} />
                </Button>
              </Tooltip>
              <Tooltip label={'Block view'}>
                <Button
                  backgroundColor={'#DCDDE2'}
                  color={blockView ? '#242629' : '#8D929A'}
                  minW={0}
                  h={'auto'}
                  padding={'8px'}
                  border={'1px solid #DCDDE2'}
                  _hover={{ backgroundColor: '#DCDDE2' }}
                  _disabled={{ backgroundColor: '#fff' }}
                  isDisabled={blockView}
                  onClick={() => {
                    setHeightView(false);
                    setBlockView(true);
                  }}
                  cursor={blockView ? 'default' : 'pointer'}
                >
                  <Icon as={BsGrid} width={'16px'} height={'16px'} />
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
          <FormControl display="flex" alignItems="center" gap={'12px'}>
            <Switch
              id="live-updates"
              onChange={() => setLiveUpdates(!liveUpdates)}
              isChecked={liveUpdates}
            />
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
            margin={'4.5px -24px 6px -24px'}
            padding={'8px 24px'}
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
                <CountUp start={oldBlocksCount} end={newBlocksCount} duration={1.25} delay={0}>
                  {({ countUpRef, start }) => <span ref={countUpRef} />}
                </CountUp>
              </Text>{' '}
              new Stacks blocks have come in
            </Text>
            <TextLink
              href={'javascript:void(0)'}
              color={`brand.${colorMode}`}
              _hover={{ textDecoration: 'underline' }}
              onClick={() => {
                setLoading(true);
                setOldBlocksCount(newBlocksCount);
                setNewBlocksCount(0);
                setTimeout(() => {
                  setLoading(false);
                }, 1250);
              }}
            >
              <Flex alignItems={'center'} gap={'6px'}>
                <Icon
                  as={TfiReload}
                  w={'12px'}
                  h={'12px'}
                  transform={'rotate(90deg) scaleX(-1)'}
                  css={{
                    animation: `${spin} 0.5s linear infinite`,
                    animationPlayState: loading ? 'running' : 'paused',
                  }}
                />
                <Text fontSize={'14px'}>Update</Text>
              </Flex>
            </TextLink>
          </Flex>
        </Stack>
      }
      footer={
        <>
          <Button
            width={'100%'}
            backgroundColor={'#fff'}
            color={'#242629'}
            fontWeight={500}
            borderWidth={'1px'}
            _hover={{
              backgroundColor: '#F9F9FA',
            }}
          >
            View all recent blocks <Icon as={HiMiniArrowUpRight} width={'16px'} height={'16px'} />
          </Button>
        </>
      }
    ></SectionWithControls>
  );
}
