import { Flex, Icon } from '@chakra-ui/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Link } from '../../../ui/Link';

export enum NavDirection {
  Forward = 'forward',
  Backward = 'backward',
}

export function NavBlock({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: NavDirection;
  isDisabled?: boolean;
}) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Link
      href={buildUrl(href!, network)}
      height={8}
      width={8}
      border="2px solid"
      borderColor="redesignBorderPrimary"
      borderRadius="md"
      style={
        isDisabled
          ? {
              cursor: 'not-allowed',
              pointerEvents: 'none',
              opacity: 0.5,
            }
          : {}
      }
    >
      <Flex alignItems="center" justifyContent="center" height="100%" width="100%">
        <Icon h={4} w={4} color="iconTertiary">
          {direction === NavDirection.Forward ? <ArrowRight /> : <ArrowLeft />}
        </Icon>
      </Flex>
    </Link>
  );
}
