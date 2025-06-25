import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

import { TransactionTypeFilterTrigger } from '../TransactionTypeFilterTrigger';

describe('TransactionTypeFilterTriggerText', () => {
  test('displays Contract deploy label when smart_contract filter is active', () => {
    renderWithChakraProviders(
      <TransactionTypeFilterTrigger
        open={false}
        transactionType={['smart_contract']}
        transactionTypeFilterHandler={() => {}}
        filterContainerProps={() => ({})}
      />
    );
    expect(screen.getByText('Contract deploy')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
  });
});
