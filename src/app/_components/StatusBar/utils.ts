import { IncidentImpact } from 'statuspage.io';

export const getColor = (incidentImpact: IncidentImpact, colorMode: string) => {
  switch (incidentImpact) {
    case IncidentImpact.Critical:
    case IncidentImpact.Major:
      return colorMode === 'light' ? 'red.500' : 'red.600';
    case IncidentImpact.Minor:
      return colorMode === 'light' ? 'orange.500' : 'orange.600';
    default:
      return colorMode === 'light' ? 'purple.400' : 'purple.600';
  }
};
