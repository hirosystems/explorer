import { Flex, Icon } from '@chakra-ui/react';
import { Warning } from '@phosphor-icons/react';

import { Link } from '../../ui/Link';
import { Text } from '../../ui/Text';

export function Sip10Disclaimer() {
  return (
    <Flex>
      <Text color="textSubdued" fontSize="sm" lineHeight="tall" letterSpacing="normal">
        <Icon color="textSubdued" h={4} w={4} justifyContent={'center'} mr={1}>
          <Warning />
        </Icon>
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
