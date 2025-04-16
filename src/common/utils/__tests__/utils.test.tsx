import { render, screen } from '@testing-library/react';

import { getTxTypeColor, getTxTypeIcon, getTxTypeLabel } from '../transactions';
import { formatNumber, semanticTokenToCssVar } from '../utils';

jest.mock('@phosphor-icons/react', () => ({
  PhoneCall: () => <div data-testid="phone-call">PhoneCall</div>,
  Cube: () => <div data-testid="cube">Cube</div>,
  Question: () => <div data-testid="question">Question</div>,
  TransferIcon: () => <div data-testid="transfer-icon">TransferIcon</div>,
  ClarityIcon: () => <div data-testid="clarity-icon">ClarityIcon</div>,
  ArrowsClockwise: () => <div data-testid="arrows-clockwise">ArrowsClockwise</div>,
}));

jest.mock('@/ui/icons/TransferIcon', () => () => (
  <div data-testid="transfer-icon">TransferIcon</div>
));

jest.mock('@/ui/icons/ClarityIcon', () => () => <div data-testid="clarity-icon">ClarityIcon</div>);

describe('semanticTokenToCssVar', () => {
  test('should convert dot notation tokens to CSS variables', () => {
    expect(semanticTokenToCssVar('colors.primary')).toBe('var(--stacks-colors-colors-primary)');
  });

  test('should convert camelCase tokens to kebab case CSS variables', () => {
    expect(semanticTokenToCssVar('textPrimary')).toBe('var(--stacks-colors-text-primary)');
  });

  test('should handle mixed camelCase and dot notation', () => {
    expect(semanticTokenToCssVar('colors.textPrimary')).toBe(
      'var(--stacks-colors-colors-text-primary)'
    );
  });
});

describe('getTxTypeColor', () => {
  test('should return correct color for token_transfer', () => {
    expect(getTxTypeColor('token_transfer')).toBe('transactionTypes.tokenTransfer');
  });

  test('should return correct color for contract_call', () => {
    expect(getTxTypeColor('contract_call')).toBe('transactionTypes.contractCall');
  });

  test('should return correct color for smart_contract', () => {
    expect(getTxTypeColor('smart_contract')).toBe('transactionTypes.contractDeploy');
  });

  test('should return correct color for tenure_change', () => {
    expect(getTxTypeColor('tenure_change')).toBe('transactionTypes.tenureChange');
  });

  test('should return correct color for coinbase', () => {
    expect(getTxTypeColor('coinbase')).toBe('transactionTypes.coinbase');
  });

  test('should return token_transfer color for unknown transaction type', () => {
    expect(getTxTypeColor('unknown_type')).toBe('transactionTypes.tokenTransfer');
  });
});

describe('getTxTypeLabel', () => {
  test('should return correct label for token_transfer', () => {
    expect(getTxTypeLabel('token_transfer')).toBe('Token transfer');
  });

  test('should return correct label for contract_call', () => {
    expect(getTxTypeLabel('contract_call')).toBe('Contract call');
  });

  test('should return correct label for smart_contract', () => {
    expect(getTxTypeLabel('smart_contract')).toBe('Contract deploy');
  });

  test('should return correct label for tenure_change', () => {
    expect(getTxTypeLabel('tenure_change')).toBe('Tenure change');
  });

  test('should return correct label for coinbase', () => {
    expect(getTxTypeLabel('coinbase')).toBe('Coinbase');
  });

  test('should return Unknown for unknown transaction type', () => {
    expect(getTxTypeLabel('unknown_type')).toBe('Unknown');
  });
});

describe('getTxTypeIcon', () => {
  test('should return ArrowsLeftRight icon for token_transfer', () => {
    const icon = getTxTypeIcon('token_transfer');
    render(<>{icon}</>);
    expect(screen.getByTestId('transfer-icon')).toBeInTheDocument();
  });

  test('should return PhoneCall icon for contract_call', () => {
    const icon = getTxTypeIcon('contract_call');
    render(<>{icon}</>);
    expect(screen.getByTestId('phone-call')).toBeInTheDocument();
  });

  test('should return ClarityIcon for smart_contract', () => {
    const icon = getTxTypeIcon('smart_contract');
    render(<>{icon}</>);
    expect(screen.getByTestId('clarity-icon')).toBeInTheDocument();
  });

  test('should return ArrowsClockwise icon for tenure_change', () => {
    const icon = getTxTypeIcon('tenure_change');
    render(<>{icon}</>);
    expect(screen.getByTestId('arrows-clockwise')).toBeInTheDocument();
  });

  test('should return Question icon for unknown transaction type', () => {
    const icon = getTxTypeIcon('unknown_type');
    render(<>{icon}</>);
    expect(screen.getByTestId('question')).toBeInTheDocument();
  });

  test('should return Cube icon for coinbase', () => {
    const icon = getTxTypeIcon('coinbase');
    render(<>{icon}</>);
    expect(screen.getByTestId('cube')).toBeInTheDocument();
  });

  test('should return TransferIcon icon for token_transfer', () => {
    const icon = getTxTypeIcon('token_transfer');
    render(<>{icon}</>);
    expect(screen.getByTestId('transfer-icon')).toBeInTheDocument();
  });
});

describe('formatNumber', () => {
  test('should return "0suffix" when num is 0', () => {
    expect(formatNumber(0, 1, 'B')).toBe('0B');
    expect(formatNumber(0, 1000, 'K')).toBe('0K');
    expect(formatNumber(0, 1000000, 'M', 2)).toBe('0M');
  });

  test('should format with decimals when provided', () => {
    expect(formatNumber(1234567, 1000000, 'M', 2)).toBe('1.23M');
    expect(formatNumber(5432100, 1000000, 'M', 2)).toBe('5.43M');
    expect(formatNumber(1234, 1000, 'K', 1)).toBe('1.2K');
    expect(formatNumber(9876, 1000, 'K', 3)).toBe('9.876K');
  });

  test('should format without specific decimal places when decimals is undefined', () => {
    const result = formatNumber(1234.5678, 1000, 'K');
    expect(result).toContain('1.2');
    expect(result).toContain('K');
    expect(result).not.toContain('.0K');
  });
});
