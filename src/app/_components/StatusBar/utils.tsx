import { Icon } from '@chakra-ui/react';
import { Info, Warning } from '@phosphor-icons/react';
import { IncidentImpact } from 'statuspage.io';

export const getColor = (incidentImpact: IncidentImpact) => {
  switch (incidentImpact) {
    case IncidentImpact.Critical:
    case IncidentImpact.Major:
      return 'var(--stacks-colors-error)';
    case IncidentImpact.Minor:
      return 'var(--stacks-colors-minor-error)';
    default:
      return 'var(--stacks-colors-status-page-incident-impact)';
  }
};

export function getIncidentImpactIcon(impact: IncidentImpact) {
  return !impact || impact === IncidentImpact.None ? (
    <Icon color={getColor(impact)}>
      <Info />
    </Icon>
  ) : (
    <Icon color={getColor(impact)}>
      <Warning />
    </Icon>
  );
}
