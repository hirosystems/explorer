import { IncidentImpact } from 'statuspage.io';

export const getColor = (incidentImpact: IncidentImpact) => {
  switch (incidentImpact) {
    case IncidentImpact.Critical:
      return 'red.600';
    case IncidentImpact.Major:
      return 'orange.600';
    case IncidentImpact.Minor:
      return 'green.600';
  }

  return 'slate.850';
};
