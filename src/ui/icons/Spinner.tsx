import { PiCircleNotch } from 'react-icons/pi';

import { Icon, IconProps } from '../Icon';

export function Spinner(props: IconProps) {
  return <Icon as={PiCircleNotch} className="fa-spin" {...props} />;
}
