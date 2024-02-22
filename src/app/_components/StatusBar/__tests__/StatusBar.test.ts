import { IncidentImpact } from 'statuspage.io';

import { getColor } from '../utils';

describe('StatusBar', () => {
  describe('getColor', () => {
    it('should return the correct color', () => {
      expect(getColor(IncidentImpact.Critical)).toEqual('red.600');
      expect(getColor(IncidentImpact.Minor)).toEqual('green.600');
      expect(getColor(IncidentImpact.Major)).toEqual('orange.600');
      expect(getColor(IncidentImpact.None)).toEqual('slate.850');
    });
  });
});
