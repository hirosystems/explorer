import { useColorModeValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import React from 'react';
import { TfiReload } from 'react-icons/tfi';

import { Flex } from '../../../ui/Flex';
import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { Switch, SwitchProps } from '../../../ui/Switch';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface ControlsProps {
  groupByBtc: SwitchProps;
  liveUpdates: SwitchProps;
  update?: {
    isLoading: boolean;
    onClick: () => void;
  };
  latestBlocksCount: number;
}

export function Controls({ groupByBtc, liveUpdates, update, latestBlocksCount }: ControlsProps) {
  const bgColor = useColorModeValue('purple.100', 'slate.900');
  const buttonColor = useColorModeValue('brand', 'purple.400');
  const textColor = useColorModeValue('slate.800', 'slate.400');
  return (
    <>
      <Stack borderBottom={update ? undefined : '1px'} py={4} marginX={-6} px={6}>
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
        </Flex>
        <FormControl display="flex" alignItems="center" gap={3}>
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
      </Stack>

      {update && (
        <Flex
          justifyContent={'space-between'}
          backgroundColor={bgColor}
          marginX={-6}
          px={6}
          py={2.5}
          gap={1}
        >
          <Text
            fontSize={'14px'}
            color={textColor}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
          >
            <Text display={'inline'} fontWeight={700}>
              {latestBlocksCount}
            </Text>{' '}
            new Stacks blocks have come in
          </Text>
          <TextLink href={'javascript:void(0)'} onClick={update.onClick}>
            <Flex alignItems={'center'} gap={'6px'}>
              <Icon
                color={buttonColor}
                as={TfiReload}
                w={'12px'}
                h={'12px'}
                transform={'rotate(90deg) scaleX(-1)'}
                css={{
                  animation: `${spin} 0.5s linear infinite`,
                  animationPlayState: update.isLoading ? 'running' : 'paused',
                }}
              />
              <Text fontSize={'14px'} color={buttonColor}>
                Update
              </Text>
            </Flex>
          </TextLink>
        </Flex>
      )}
    </>
  );
}
