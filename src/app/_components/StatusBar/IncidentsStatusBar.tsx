import { css } from '@emotion/react';
import { IncidentImpact } from 'statuspage.io';

import { useUnresolvedIncidents } from '../../../common/queries/useUnresolvedIncidents';
import { Flex } from '../../../ui/Flex';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';
import { StatusBarBase } from './StatusBarBase';
import { getColor } from './utils';

const incidentImpactSeverity: Record<IncidentImpact, number> = {
  [IncidentImpact.None]: 0,
  [IncidentImpact.Minor]: 1,
  [IncidentImpact.Major]: 2,
  [IncidentImpact.Critical]: 3,
};

export function IncidentsStatusBar() {
  const { data: unresolvedIncidentsResponse } = useUnresolvedIncidents();

  const allIncidents = unresolvedIncidentsResponse?.incidents?.map(({ name }) => name).join(' - ');
  const highestImpact = unresolvedIncidentsResponse?.incidents?.reduce(
    (acc, { impact }) =>
      incidentImpactSeverity[impact] > incidentImpactSeverity[acc] ? impact : acc,
    IncidentImpact.None
  );
  if (!highestImpact || !allIncidents) return null;
  return (
    <StatusBarBase
      impact={highestImpact}
      content={
        <Flex>
          <Text
            color={getColor(highestImpact)}
            fontWeight={'medium'}
            fontSize={'14px'}
            lineHeight={'1.5'}
          >
            {allIncidents}
            {allIncidents.endsWith('.') ? '' : '.'}
          </Text>
          &nbsp;
          <Text fontWeight={400} fontSize={'14px'} color={'#000000'} lineHeight={'1.5'}>
            More information on the{' '}
            <TextLink
              href="https://status.hiro.so/"
              target="_blank"
              css={css`
                display: inline;
                text-decoration: underline;
              `}
            >
              Hiro status page
            </TextLink>
            .
          </Text>
        </Flex>
      }
    />
  );
}
