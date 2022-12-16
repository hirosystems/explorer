import {
  IconChartBar,
  IconCurrencyBitcoin,
  IconCurrencyDollar,
  IconSignature,
} from '@tabler/icons';
import React, { FC } from 'react';

import { Circle, Stack, color } from '@stacks/ui';

import { border } from '@common/utils';

import { ExplorerLink } from '@components/links';
import { Section } from '@components/section';
import { Caption, Title } from '@components/typography';

const defaultContracts = (address: string) => [
  {
    name: 'pox',
    address,
    description: '',
    icon: IconCurrencyBitcoin,
  },
  {
    name: 'bns',
    address,
    description: '',
    icon: IconSignature,
  },
  {
    name: 'cost-voting',
    address,
    description: '',
    icon: IconChartBar,
  },
  {
    name: 'costs',
    address,
    description: '',
    icon: IconCurrencyDollar,
  },
];

export const PopularContracts: FC<{ rootContractAddress: string }> = ({ rootContractAddress }) => (
  <>
    <Title fontWeight={400}>Or select from one of these</Title>
    <Stack mt="loose" spacing="loose">
      {defaultContracts(rootContractAddress).map(({ name, address, icon: Icon }) => (
        <ExplorerLink path={`/sandbox/contract-call/${address}.${name}`} key={name}>
          <Section
            color={color('text-title')}
            p="loose"
            _hover={{ cursor: 'pointer', color: color('brand') }}
          >
            <Stack isInline spacing="base">
              <Circle border={border()}>
                <Icon />
              </Circle>
              <Stack>
                <Title color="currentColor">{name}</Title>
                <Caption>{address}</Caption>
              </Stack>
            </Stack>
          </Section>
        </ExplorerLink>
      ))}
    </Stack>
  </>
);
