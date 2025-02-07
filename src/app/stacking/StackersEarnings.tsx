import { Card } from '@/common/components/Card';
import { Text } from '@/ui/Text';
import { Box, Flex, Stack, Tabs } from '@chakra-ui/react';

function CustomTab({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <Tabs.Trigger value={value}>
      <Box py={2} px={4} bg="sand.150" borderRadius="full">
        {children}
      </Box>
    </Tabs.Trigger>
  );
}

export function StackersEarnings() {
  return (
    <Card p={5} bg="sand.50" border="1px solid var(--stacks-colors-sand-150)" w="full">
      <Flex>
        <Tabs.Root>
          <Tabs.List mb={4} p={0} border="none">
            <Tabs.Trigger value="all-time">All Time</Tabs.Trigger>
            <Tabs.Trigger value="last-cycle">Last Cycle</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="all-time" gap={0}>
            <Stack gap={2}>
              <Text fontSize={20}>Stackers have earned</Text>
              <Flex alignItems="self-end" gap={1}>
                <Text fontSize={30} fontWeight="semi-bold">
                  142,532 BTC
                </Text>
                <Text fontSize={20} color="textSubdued">
                  ($8.4M)
                </Text>
              </Flex>
              <Text fontSize={20}>in rewards ✨</Text>
            </Stack>
          </Tabs.Content>
          <Tabs.Content value="last-cycle" gap={0}></Tabs.Content>
        </Tabs.Root>
      </Flex>
    </Card>
  );
}
