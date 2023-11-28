import React, { FC } from 'react';
import { TbChartBar, TbCurrencyBitcoin, TbCurrencyDollar, TbSignature } from 'react-icons/tb';

import { ExplorerLink } from '../../../../../common/components/ExplorerLinks';
import { Section } from '../../../../../common/components/Section';
import { Circle } from '../../../../../ui/Circle';
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
    <Stack mt="24px" spacing="24px">
      {defaultContracts(rootContractAddress).map(({ name, address, icon: Icon }) => (
        <ExplorerLink href={`/sandbox/contract-call/${address}.${name}`} key={name}>
          <Section color={'textTitle'} p="24px" _hover={{ cursor: 'pointer', color: 'brand' }}>
            <Stack isInline spacing="16px">
              <Circle>
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
