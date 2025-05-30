import { Flex } from '@chakra-ui/react';
import { IncidentImpact } from 'statuspage.io';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import { StatusBarBase } from './StatusBarBase';
import { getIncidentImpactIcon } from './utils';

export function isHiroSubdomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    return hostname.endsWith(`.hiro.so`);
  } catch (e) {
    return false;
  }
}

export function NonHiroNetworkWarningBar() {
  const { activeNetworkKey } = useGlobalContext();
  if (isHiroSubdomain(activeNetworkKey)) {
    return null;
  }

  const icon = getIncidentImpactIcon(IncidentImpact.Major);
  const content = (
    <Text fontSize={'xs'}>
      Reminder: You are on a local devnet environment. This is not an official public Stacks
      network. Please ensure that the source is trustworthy and not malicious, as it could lead to a
      phishing attack.{' '}
      <TextLink href={'https://explorer.hiro.so/?chain=mainnet'} textDecoration={'underline'}>
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
