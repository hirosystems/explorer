import * as React from 'react';
import { Section } from '@components/section';
import { Box, color, Flex } from '@stacks/ui';
import { IconAlertCircle } from '@tabler/icons';
import { Text } from '@components/typography';
import { capitalize } from '@common/utils';
import { AddressLink } from '@components/links';
import { Link } from '@components/link';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const IncorrectAddressModeNotice: React.FC<{ address: string }> = ({ address }) => {
  const networkMode = useAppSelector(selectActiveNetwork).mode;
  const invert = networkMode && networkMode.toLowerCase() === 'testnet' ? 'mainnet' : 'testnet';
  return (
    <Section mb="extra-loose">
      <Flex alignItems="center" justifyContent="space-between" p="base-loose">
        <Flex alignItems="center">
          <Box mr="tight" as={IconAlertCircle} color={color('feedback-alert')} />
          <Text color={color('text-body')}>
            This is a <strong>{capitalize(invert)}</strong> address, but you are viewing data from
            the <strong>{networkMode}</strong> Stacks Network.
          </Text>
        </Flex>

        <AddressLink principal={address}>
          <Link
            fontSize={1}
            color={color('brand')}
            textDecoration="none"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            Update address
          </Link>
        </AddressLink>
      </Flex>
    </Section>
  );
};
