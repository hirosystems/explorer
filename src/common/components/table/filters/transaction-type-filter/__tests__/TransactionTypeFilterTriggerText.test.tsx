import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

import { TransactionTypeFilterTriggerText } from '../TransactionTypeFilterTriggerText';

describe('TransactionTypeFilterTriggerText', () => {
  test('displays Contract deploy label when smart_contract filter is active', () => {
    renderWithChakraProviders(
      <TransactionTypeFilterTriggerText
        open={false}
        defaultTransactionType={['smart_contract']}
      />
    );
    expect(screen.getByText('Contract deploy')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
  });
});
