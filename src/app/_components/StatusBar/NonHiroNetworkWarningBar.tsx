import { Flex } from '@chakra-ui/react';
import { IncidentImpact } from 'statuspage.io';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { isHiroSubdomain, isLocalhost } from '../../../common/utils/network-utils';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import { StatusBarBase } from './StatusBarBase';
import { getIncidentImpactIcon } from './utils';

export function NonHiroNetworkWarningBar() {
  const { activeNetworkKey } = useGlobalContext();

  if (isHiroSubdomain(activeNetworkKey)) {
    return null;
  }

  const icon = getIncidentImpactIcon(IncidentImpact.Major);
  const isDevnet = isLocalhost(activeNetworkKey);

  const content = isDevnet ? (
    <Text fontSize={'xs'}>
      You are on a local devnet environment.{' '}
      <TextLink
        href={'https://explorer.hiro.so/?chain=mainnet'}
        textDecoration={'underline'}
        color="textInvert"
        display="inline-block"
      >
        Click here
      </TextLink>{' '}
      to access the official Stacks Mainnet network.
    </Text>
  ) : (
    <Text fontSize={'xs'}>
      Reminder: This is not an official public Stacks network. Please ensure that the source is
      trustworthy and not malicious, as it could lead to a phishing attack.{' '}
      <TextLink
        href={'https://explorer.hiro.so/?chain=mainnet'}
        textDecoration={'underline'}
        color="textInvert"
        display="inline-block"
      >
        Click here
      </TextLink>{' '}
      to access the Stacks Mainnet network.
    </Text>
  );

  return (
    <StatusBarBase
      content={
        <Flex gap={1.5} alignItems="center">
          {icon}
          {content}
        </Flex>
      }
    />
  );
}
