import { IncidentImpact } from 'statuspage.io';

export const getColor = (incidentImpact: IncidentImpact) =>
  incidentImpact === IncidentImpact.Critical ? '#C83532' : '#A96500';
