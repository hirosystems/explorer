import { Card } from '../../common/components/Card';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Stack } from '../../ui/Stack';
import { Tab } from '../../ui/Tab';
import { TabList } from '../../ui/TabList';
import { TabPanel } from '../../ui/TabPanel';
import { TabPanels } from '../../ui/TabPanels';
import { Tabs } from '../../ui/Tabs';
import { Text } from '../../ui/Text';

function CustomTab({ children }: { children: React.ReactNode }) {
  return (
    <Tab>
      <Box py={2} px={4} bg="sand.150" borderRadius="full">
        {children}
      </Box>
    </Tab>
  );
}

export function StackersEarnings() {
  return (
    <Card p={5} bg="sand.50" border="1px solid var(--stacks-colors-sand-150)">
      <Flex>
        <Tabs>
          <TabList mb={4} p={0} border="none">
            <Tab>All Time</Tab>
            <Tab>Last Cycle</Tab>
          </TabList>
          <TabPanels>
            <TabPanel gap={0}>
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
            </TabPanel>
            <TabPanel gap={0}></TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Card>
  );
}
