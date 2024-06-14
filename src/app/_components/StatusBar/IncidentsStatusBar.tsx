import { useColorModeValue } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { useRef } from 'react';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { useUnresolvedIncidents } from '../../../common/queries/useUnresolvedIncidents';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import { useColorMode } from '../../../ui/hooks/useColorMode';
import { StatusBarBase } from './StatusBarBase';
import { getColor } from './utils';

export function IncidentsStatusBar(props: FlexProps) {
  const isTestnet = useGlobalContext().activeNetwork.mode === 'testnet';
  const { data: unresolvedIncidentsResponse, isFetching } = useUnresolvedIncidents();
  const incidents = unresolvedIncidentsResponse?.incidents;
  const statusBarRef = useRef<HTMLDivElement | null>(null);
  const colorMode = useColorMode().colorMode;

  return (
    <Flex direction={'column'} {...props}>
      {incidents?.map(({ name, impact }) => {
        const isTestnetUpdate = name.includes('Testnet Update:');
        if (isTestnetUpdate && !isTestnet) return null;
        return (
          <StatusBarBase
            ref={statusBarRef}
            impact={impact}
            content={
              <Flex direction={'column'} gap={'8px'} flexGrow={1}>
                <Text fontSize={'xs'} display={'inline'}>
                  {name}
                  {name.endsWith('.') ? '' : '.'}
                  <Text fontSize={'xs'} display={'inline'}>
                    {' '}
                    More information on the{' '}
                    <TextLink
                      href="https://status.hiro.so/"
                      target="_blank"
                      color={getColor(impact, colorMode)}
                      css={css`
                        display: inline;
                        text-decoration: underline;
                      `}
                    >
                      Hiro status page
                    </TextLink>
                    .
                  </Text>
                </Text>
              </Flex>
            }
          />
        );
      })}
    </Flex>
  );
}
