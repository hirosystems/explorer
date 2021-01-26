import React from 'react';
import { ContractSearch } from '@sandbox/components/screens/call-functions/components/contract-search';
import { Box, Circle, color, Flex, Grid, Stack } from '@stacks/ui';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { functionCallViewState } from '@sandbox/store/views';
import { CalledContractDetails } from '@sandbox/components/screens/call-functions/components/contract-details';
import { BackElement } from '@sandbox/components/screens/call-functions/components/back-element';
import { border } from '@common/utils';
import { AvailableFunctions } from '@sandbox/components/screens/call-functions/components/available-functions';
import { LoadingPanel } from '@components/loading-panel';
import { Caption, Text, Title } from '@components/typography';
import { Section } from '@components/section';
import { contractSearchQueryState } from '@sandbox/store/sandbox';
import {
  IconArrowsSplit,
  IconChartBar,
  IconCurrencyBitcoin,
  IconCurrencyDollar,
  IconSignature,
} from '@tabler/icons';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';
import { Button } from '@components/button';
import { ErrorWrapper } from '@sandbox/components/error-wrapper';

const defaultContracts = [
  {
    name: 'pox',
    address: 'SP000000000000000000002Q6VF78',
    description: '',
    icon: IconCurrencyBitcoin,
  },
  {
    name: 'bns',
    address: 'SP000000000000000000002Q6VF78',
    description: '',
    icon: IconSignature,
  },
  {
    name: 'cost-voting',
    address: 'SP000000000000000000002Q6VF78',
    description: '',
    icon: IconChartBar,
  },
  {
    name: 'costs',
    address: 'SP000000000000000000002Q6VF78',
    description: '',
    icon: IconCurrencyDollar,
  },
];

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <Stack spacing="loose" p="extra-loose" role="alert">
      <Flex flexDirection="column" borderRadius="8px" alignItems="center">
        <Circle mb="loose" transform="translateY(2px)" size="84px" mr="tight" border={border()}>
          <AlertTriangleIcon size="52px" color={color('feedback-error')} />
        </Circle>
        <Title mb="base" fontSize="24px">
          Something went wrong
        </Title>
        <Text color={color('text-body')} lineHeight="26px" maxWidth="50ch" textAlign="center">
          {error}
        </Text>
      </Flex>
      <Button mx="auto" onClick={resetErrorBoundary}>
        Search again
      </Button>
    </Stack>
  );
}

export const FunctionCallView: React.FC = () => {
  const [view, setView] = useRecoilState(functionCallViewState);
  const setQuery = useSetRecoilState(contractSearchQueryState);

  switch (view) {
    case 'initial':
      return (
        <Grid
          minHeight="600px"
          gridTemplateColumns={`600px 0.5fr 0.5fr`}
          flexGrow={1}
          flexShrink={1}
        >
          <Box borderRight={border()}>
            <ContractSearch />
          </Box>
          <Box p="extra-loose">
            <Title fontWeight={400}>Or select from one of these</Title>
            <Stack mt="loose" spacing="loose">
              {defaultContracts.map(({ name, address, icon: Icon }) => (
                <Section
                  p="loose"
                  onClick={() => {
                    setQuery(`${address}.${name}`);
                    setView('function-overview');
                  }}
                >
                  <Stack isInline spacing="base">
                    <Circle border={border()}>
                      <Icon />
                    </Circle>
                    <Stack>
                      <Title>{name}</Title>
                      <Caption>{address}</Caption>
                    </Stack>
                  </Stack>
                </Section>
              ))}
            </Stack>
          </Box>
        </Grid>
      );
    case 'function-overview':
      return (
        <ErrorWrapper
          onReset={() => {
            setView('initial');
            setQuery('');
          }}
          fallback={ErrorFallback}
        >
          <React.Suspense fallback={<LoadingPanel text="Loading..." />}>
            <Grid
              minHeight="600px"
              gridTemplateColumns={`365px 0.5fr 0.5fr`}
              flexGrow={1}
              flexShrink={1}
            >
              <Box borderRight={border()} p="base">
                <BackElement onClick={() => setView('initial')} />
                <CalledContractDetails />
              </Box>
              <Box
                overflow="auto"
                maxHeight={'calc(100vh - 217px)'}
                borderRight={border()}
                p="base"
              >
                <AvailableFunctions />
              </Box>
            </Grid>
          </React.Suspense>
        </ErrorWrapper>
      );
  }
};
