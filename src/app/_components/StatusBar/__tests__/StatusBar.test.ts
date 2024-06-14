import { IncidentImpact } from 'statuspage.io';

import { getColor } from '../utils';

describe('StatusBar', () => {
  describe('getColor', () => {
    it('should return the correct color', () => {
      expect(getColor(IncidentImpact.Minor, 'light')).toEqual('orange.500');
      expect(getColor(IncidentImpact.Major, 'light')).toEqual('red.500');
      expect(getColor(IncidentImpact.Critical, 'light')).toEqual('red.500');
      expect(getColor(IncidentImpact.None, 'light')).toEqual('purple.400');
    });
  });
});
