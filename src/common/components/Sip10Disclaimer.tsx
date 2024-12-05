import { Warning } from '@phosphor-icons/react';

import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Text } from '../../ui/Text';

export function Sip10Disclaimer() {
  return (
    <Flex>
      <Icon color="textSubdued" mr={2} size={4}>
        <Warning />
      </Icon>
      <Text color="textSubdued" fontSize="sm" lineHeight="tall" letterSpacing="normal">
        Please note that SIP-10 data is extracted from third party providers. We make no
        representations or warranties as to the third party content and do not guarantee its
        accuracy, timeliness, completeness or usefulness. For more information, please review our{' '}
        <Link href="hiro.so/terms" type="aTag">
          Terms
        </Link>{' '}
        &{' '}
        <Link href="hiro.so/privacy" type="aTag">
          Privacy Policy
        </Link>
        .
      </Text>
    </Flex>
  );
}
