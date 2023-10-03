import { useColorMode } from '@chakra-ui/react';

import { TbMenu2, TbUser } from 'react-icons/tb';
import { PageTitle } from '@/appPages/common/components/PageTitle';
import { TwoColumnPage } from '@/appPages/common/components/TwoColumnPage';
import { SideNav } from '@/appPages/sandbox/layout/SideNav';
import { TwoColsListItem } from '@/common/components/TwoColumnsListItem';
import { Section } from '@/components/section';
import { Box } from '@/ui/Box';
import { Circle } from '@/ui/Circle';
import { Flex } from '@/ui/Flex';
import { Grid } from '@/ui/Grid';
import { IconButton } from '@/ui/IconButton';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';
import { Caption, Title } from '@/ui/typography';

import { ExplorerSkeletonLoader } from './skeleton-common';

export const SkeletonTxListItem = () => (
  <TwoColsListItem
    icon={<ExplorerSkeletonLoader width="40px" height="40px" circle />}
    leftContent={{
      title: <ExplorerSkeletonLoader width="275px" height="20px" />,
      subtitle: <ExplorerSkeletonLoader width="212px" height="16px" />,
    }}
    rightContent={{
      title: <ExplorerSkeletonLoader width="79px" height="14px" />,
      subtitle: <ExplorerSkeletonLoader width="185px" height="12px" />,
    }}
  />
);

export const SkeletonTxListItemMini = () => (
  <TwoColsListItem
    icon={<ExplorerSkeletonLoader width="40px" height="40px" circle />}
    leftContent={{
      title: <ExplorerSkeletonLoader width="275px" height="20px" />,
      subtitle: <ExplorerSkeletonLoader width="212px" height="16px" />,
    }}
  />
);

export const SkeletonBlock = () => (
  <TwoColsListItem
    icon={<ExplorerSkeletonLoader width="40px" height="40px" circle />}
    leftContent={{
      title: <ExplorerSkeletonLoader width="192px" height="15px" />,
      subtitle: <ExplorerSkeletonLoader width="180px" height="12px" />,
    }}
    rightContent={{
      title: <ExplorerSkeletonLoader width="89px" height="14px" />,
      subtitle: <ExplorerSkeletonLoader width="72px" height="12px" />,
    }}
  />
);

export const SkeletonAccountTransactionList = () => (
  <Section title="Transactions">
    <Box px="24px" data-test="account-transaction-list">
      <SkeletonTransactionList />
    </Box>
  </Section>
);

export const SkeletonGenericTransactionList = () => <SkeletonTransactionList />;

const SkeletonTxidSummary = () => {
  const content = ['long', 'long', 'long', 'short', 'short', 'long'];
  return (
    <Box>
      {content.map((type, i) => {
        return type === 'long' ? (
          <SkeletonSummaryRow key={i} />
        ) : (
          <SkeletonSummaryRowShortContent key={i} />
        );
      })}
    </Box>
  );
};

const SkeletonSummaryRow = () => {
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      py={['16px', '16px', '24px']}
      width="100%"
      alignItems={['unset', 'unset', 'center']}
      borderTopWidth="1px"
      borderBottomWidth="1px"
      px="16px"
      paddingLeft="0"
      overflow="hidden"
    >
      <Flex>
        <Flex width="140px">
          <Flex width="70px">
            <ExplorerSkeletonLoader height="20px" />
          </Flex>
        </Flex>
        <Flex>
          <Flex width="450px">
            <ExplorerSkeletonLoader height="20px" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
const SkeletonSummaryRowShortContent = () => {
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      py={['16px', '16px', '24px']}
      width="100%"
      alignItems={['unset', 'unset', 'center']}
      borderTopWidth="1px"
      borderBottomWidth="1px"
      px="16px"
      paddingLeft="0"
      overflow="hidden"
    >
      <Flex>
        <Flex width="140px">
          <Flex width="70px">
            <ExplorerSkeletonLoader height="20px" />
          </Flex>
        </Flex>
        <Flex>
          <Flex width="90px">
            <ExplorerSkeletonLoader height="20px" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const SkeletonTransactionTitle = () => {
  return (
    <Flex direction="column" mb="24px">
      <Title as="h1" color="white" fontSize="36px" mt="72px" mb="16px">
        <ExplorerSkeletonLoader width="400px" height="31px" />
      </Title>
      <ExplorerSkeletonLoader width="110px" height="28px" />
    </Flex>
  );
};

const SkeletonTransactionDetails = () => {
  return (
    <Section>
      <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']}>
          <SkeletonTxidSummary />
        </Box>
      </Flex>
    </Section>
  );
};

export const SkeletonPageWithTagsAndTwoColumns = () => {
  return (
    <TwoColumnPage
      title={<SkeletonTransactionTitle />}
      leftContent={
        <>
          <SkeletonTransactionDetails />
          <SkeletonTransactionDetails />
        </>
      }
      rightContent={<SkeletonTransactionDetails />}
    />
  );
};

export const SkeletonPageWithTwoColumns = () => {
  return (
    <TwoColumnPage
      title={
        <PageTitle>
          <ExplorerSkeletonLoader width="400px" height="31px" />
        </PageTitle>
      }
      leftContent={
        <>
          <SkeletonTransactionDetails />
          <SkeletonTransactionDetails />
        </>
      }
      rightContent={<SkeletonTransactionDetails />}
    />
  );
};

export const SkeletonPageWithOneColumn = () => {
  return (
    <>
      <PageTitle>
        <ExplorerSkeletonLoader width="400px" height="31px" />
      </PageTitle>
      <Stack spacing="32px">
        <SkeletonTransactionDetails />
        <SkeletonTransactionDetails />
      </Stack>
    </>
  );
};

export const SkeletonSandbox = () => {
  return (
    <Flex
      borderWidth="1px"
      borderRadius="12px"
      bg={`bg.${useColorMode().colorMode}`}
      flexDirection="column"
      flexGrow={1}
      flexShrink={1}
      mb="32px"
    >
      <Flex alignItems="center" justifyContent="space-between" borderBottomWidth="1px">
        <Box p="16px" color="textTitle">
          <ExplorerSkeletonLoader width="200px" height="18px" />
        </Box>
        <Flex alignItems="center" px="16px">
          <Stack spacing="24px" isInline>
            <Stack isInline alignItems="center">
              <Circle color="textBody" size="20px">
                <TbUser size="14px" />
              </Circle>
              <Caption>
                <ExplorerSkeletonLoader width="200px" height="18px" />
              </Caption>
            </Stack>
            <Stack isInline alignItems="center">
              <IconButton color="textTitle" icon={<TbMenu2 />} aria-label="Toggle right panel" />
            </Stack>
          </Stack>
        </Flex>
      </Flex>
      <Grid
        gridTemplateColumns="72px 1fr"
        minHeight="calc(100vh - 217px)"
        flexGrow={1}
        flexShrink={1}
      >
        <SideNav />
        <Spinner alignSelf="center" justifySelf="center" size="32px" />
      </Grid>
    </Flex>
  );
};

export const SkeletonTransactionList = ({ length }: { length?: number }) => {
  const num = length ?? 10;
  return (
    <Box position="relative" px="20px">
      {Array.from({ length: num }, (_, i) => (
        <SkeletonTxListItem key={i} />
      ))}
    </Box>
  );
};

export const SectionBoxSkeleton = () => (
  <Section mt="32px">
    <Box p="16px">
      <SkeletonTransactionList />
    </Box>
  </Section>
);
