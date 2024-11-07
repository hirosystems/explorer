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
