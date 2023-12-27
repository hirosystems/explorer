import React, { FC } from 'react';
import { TbChartBar, TbCurrencyBitcoin, TbCurrencyDollar, TbSignature } from 'react-icons/tb';

import { Circle } from '../../../../../common/components/Circle';
import { ExplorerLink } from '../../../../../common/components/ExplorerLinks';
import { Section } from '../../../../../common/components/Section';
import { HStack } from '../../../../../ui/HStack';
import { Stack } from '../../../../../ui/Stack';
import { Caption, Title } from '../../../../../ui/typography';

const defaultContracts = (address: string) => [
  {
    name: 'pox-3',
    address,
    description: '',
    icon: TbCurrencyBitcoin,
  },
  {
    name: 'bns',
    address,
    description: '',
    icon: TbSignature,
  },
  {
    name: 'cost-voting',
    address,
    description: '',
    icon: TbChartBar,
  },
  {
    name: 'costs-3',
    address,
    description: '',
    icon: TbCurrencyDollar,
  },
];

export const PopularContracts: FC<{ rootContractAddress: string }> = ({ rootContractAddress }) => (
  <>
    <Title fontWeight={400}>Or select from one of these</Title>
    <Stack mt="24px" gap={6}>
      {defaultContracts(rootContractAddress).map(({ name, address, icon: Icon }) => (
        <ExplorerLink href={`/sandbox/contract-call/${address}.${name}`} key={name}>
          <Section color={'textTitle'} p="24px" _hover={{ cursor: 'pointer', color: 'brand' }}>
            <HStack gap={4}>
              <Circle>
                <Icon />
              </Circle>
              <Stack>
                <Title color="currentColor">{name}</Title>
                <Caption>{address}</Caption>
              </Stack>
            </HStack>
          </Section>
        </ExplorerLink>
      ))}
    </Stack>
  </>
);
