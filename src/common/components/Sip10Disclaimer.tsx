import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';
import { Link } from '../../ui/Link';
import { PiWarningLight } from 'react-icons/pi';

export function Sip10Disclaimer() {
  return (
    <Flex >
      <Icon as={PiWarningLight} color="secondaryText" mr={2} size={4} />
      <Text color="secondaryText" fontSize=" 14px" lineHeight=" 20px" letterSpacing=" -0.14px">
        Please note that SIP-10 data is extracted from third party providers. We make no
        representations or warranties as to the third party content and do not guarantee its
        accuracy, timeliness, completeness or usefulness. For more information, please review our{' '}
        <Link href="hiro.so/terms" variant="aTag">
          Terms
        </Link>{' '}
        &{' '}
        <Link href="hiro.so/privacy" variant="aTag">
          Privacy Policy
        </Link>
        .
      </Text>
    </Flex>
  );
}