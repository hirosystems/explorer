import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import { IncidentImpact } from 'statuspage.io';

import { getIncidentImpactIcon } from '../utils';

jest.mock('@phosphor-icons/react', () => ({
  __esModule: true,
  Info: () => <span data-testid="info-icon">Info</span>,
  Warning: () => <span data-testid="warning-icon">Warning</span>,
}));

describe('getIncidentImpactIcon', () => {
  it('renders Info icon when impact is None or falsy', () => {
    const { getByTestId } = renderWithChakraProviders(getIncidentImpactIcon(IncidentImpact.None));
    expect(getByTestId('info-icon')).toBeInTheDocument();
  });
  it('renders Info icon when impact is None or falsy', () => {
    const { getByTestId: getByTestId2 } = renderWithChakraProviders(
      getIncidentImpactIcon(undefined as any)
    );
    expect(getByTestId2('info-icon')).toBeInTheDocument();
  });

  it('renders Warning icon when impact is Minor', () => {
    const { getByTestId: getByTestId2 } = renderWithChakraProviders(
      getIncidentImpactIcon(IncidentImpact.Minor)
    );
    expect(getByTestId2('warning-icon')).toBeInTheDocument();
  });
  it('renders Warning icon when impact is Major', () => {
    const { getByTestId: getByTestId2 } = renderWithChakraProviders(
      getIncidentImpactIcon(IncidentImpact.Major)
    );
    expect(getByTestId2('warning-icon')).toBeInTheDocument();
  });
});
