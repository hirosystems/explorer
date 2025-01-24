import { PopoverContent, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StxIcon from '@/ui/icons/StxIcon';
import { Box, Flex, Icon, Separator, Stack, Tabs } from '@chakra-ui/react';
import { CaretDown, CaretUp, Info, Lightning } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';

const FeeStatLine = ({
  priority,
  time,
  stxFee,
  usdFee,
}: {
  priority: string;
  time: string;
  stxFee: string;
  usdFee: string;
}) => {
  return (
    <Flex justifyContent="space-between" py={2}>
      <Flex gap={1} alignItems="center">
        {priority === 'High' ? (
          <Icon color="textSubdued">
            <Lightning />
          </Icon>
        ) : null}
        <Text fontSize="xs" color="textPrimary">
          {priority}
        </Text>
        <Text fontSize="xs" color="textTertiary">
          {time}
        </Text>
      </Flex>
      <Flex color="textTertiary" fontFamily="var(--font-matter-mono)">
        <Text fontSize="xs">{`${stxFee} STX`}</Text>
        &nbsp;
        <Text fontSize="xs">{`/ ${usdFee}`}</Text>
      </Flex>
    </Flex>
  );
};

const FeeStats = ({ stxPriceInUsd }: { stxPriceInUsd: string }) => {
  return (
    <Stack gap={4}>
      <Stack>
        <Flex justifyContent="space-between">
          <Flex gap={1} alignItems="center">
            <Text fontSize="xs" color="textTertiary">
              Priority
            </Text>
            <Tooltip content="Higher fees increase the chances of a transaction being confirmed faster than others.">
              <Icon color="textTertiary">
                <Info />
              </Icon>
            </Tooltip>
          </Flex>
          <Text fontSize="xs" color="textTertiary">
            Fee
          </Text>
        </Flex>
        <FeeStatLine priority="Low" time="~53s" stxFee="0.11 STX" usdFee="0.01 USD" />
        <Separator />
        <FeeStatLine priority="Standard" time="~24s" stxFee="0.18 STX" usdFee="0.05 USD" />
        <Separator />
        <FeeStatLine priority="High" time="~12s" stxFee="0.25 STX" usdFee="0.11 USD" />
      </Stack>
      <Flex justifyContent="space-between" w="full">
        <Text fontStyle="italic" fontSize="xs" whiteSpace="wrap" color="textSecondary" w="50%">
          Current average fee rates for all transaction types
        </Text>
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="surfaceFifth"
          borderRadius="md"
          gap={1}
          py={1.5}
          px={2}
        >
          <Icon h={3} w={3} color="iconPrimary">
            <StxIcon />
          </Icon>
          <Text
            fontSize="xs"
            color="textPrimary"
            fontFamily="var(--font-matter-mono)"
          >{`1 STX = $${stxPriceInUsd}`}</Text>
        </Flex>
      </Flex>
    </Stack>
  );
};

export const FeePopover = () => {
  const [open, setOpen] = useState(false);

  const tabs = useMemo(
    () => [
      {
        id: 'average',
        title: 'Average',
        content: <FeeStats stxPriceInUsd={'1.84'} />,
      },
      {
        id: 'transfer',
        title: 'Transfer',
        content: <FeeStats stxPriceInUsd={'1.84'} />,
      },
      {
        id: 'contract-deploy',
        title: 'Contract Deploy',
        content: <FeeStats stxPriceInUsd={'1.84'} />,
      },
      {
        id: 'contract-call',
        title: 'Contract Call',
        content: <FeeStats stxPriceInUsd={'1.84'} />,
      },
    ],
    []
  );

  return (
    <PopoverRoot
      id="fee-popover"
      positioning={{
        placement: 'bottom-end',
        gutter: 0,
      }}
      open={open}
      onOpenChange={e => setOpen(e.open)}
      unstyled
    >
      <PopoverTrigger>
        <Flex
          bg="navbar.menu.bg"
          borderRadius="lg"
          borderTopRadius="lg"
          borderBottomRadius={open ? 'none' : 'lg'}
          p={2}
          gap={3}
        >
          <Text fontSize="xs" fontFamily="var(--font-matter-mono)">
            Fees: 0.18 STX
          </Text>
          <Icon>{open ? <CaretUp /> : <CaretDown />}</Icon>
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        w="fit-content"
        borderRadius="xl"
        borderTopRightRadius="none"
        border="none"
        bg="navbar.menu.bg"
      >
        <Box p={4}>
          <Tabs.Root onValueChange={({ value: id }) => {}} defaultValue={tabs[0].id}>
            <Tabs.List width="full" border={'none'} mb={4} p={0}>
              {tabs.map(tab => (
                <Tabs.Trigger
                  key={`${tab.id}-title`}
                  value={tab.id}
                  px={1}
                  color="textSecondary"
                  _selected={{
                    bg: 'surfaceInvert',
                    color: 'textInvert',
                    borderRadius: 'md',
                    _hover: {
                      bg: 'surfaceInvert', // Override hover styles when selected
                      color: 'textInvert',
                    },
                  }}
                  _hover={{
                    bg: 'surfaceTertiary',
                    color: 'textPrimary',
                  }}
                >
                  <Flex alignItems="center" justifyContent="center" py={1} px={2}>
                    <Text whiteSpace="nowrap">{tab.title}</Text>
                  </Flex>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {tabs.map(tab => (
              <Tabs.Content key={`${tab.id}-content`} value={tab.id} h="full">
                {tab.content}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      </PopoverContent>
    </PopoverRoot>
  );
};
