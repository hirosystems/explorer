import { IncidentImpact } from 'statuspage.io';

import { getColor } from '../utils';

describe('StatusBar', () => {
  describe('getColor', () => {
    it('should return the correct color', () => {
      expect(getColor(IncidentImpact.Critical)).toEqual('#C83532');
      expect(getColor(IncidentImpact.Minor)).toEqual('#A96500');
      expect(getColor(IncidentImpact.Major)).toEqual('#A96500');
      expect(getColor(IncidentImpact.None)).toEqual('#A96500');
    });
  });
});
